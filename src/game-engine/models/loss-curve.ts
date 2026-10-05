export interface LossScenario {
  baseLoss: number;
  lrStableMax: number;
  overfitEpoch: number;
  loraFloor: number;
  fullFloor: number;
  forgettingEpoch: number | null;
}

export interface LossParams {
  learningRate: number;
  epochs: number;
  batchSize: number;
  method: "full" | "lora";
}

export interface LossSeries {
  train: number[];
  val: number[];
  diverged: boolean;
  forgetting: boolean;
  finalTrain: number;
  finalVal: number;
  gap: number;
}

/**
 * Educational loss model. This is not neural-network training.
 *
 * Stable runs move training loss from baseLoss toward a method floor:
 *   progress = 1 - exp(-learningRate * 4000 * epoch)
 *   train = floor + (baseLoss - floor) * (1 - progress) + small batch noise
 *
 * Validation loss adds an overfitting gap after overfitEpoch. Full fine-tuning
 * grows that gap faster than LoRA. Full fine-tuning also adds a forgetting
 * penalty on and after forgettingEpoch. Learning rates above lrStableMax are
 * treated as divergent and the curves climb instead of falling.
 */
const LR_GAIN = 4000;

export function simulateLoss(scenario: LossScenario, params: LossParams): LossSeries {
  const diverged = params.learningRate > scenario.lrStableMax;
  const floor = params.method === "lora" ? scenario.loraFloor : scenario.fullFloor;
  const noise = 0.05 * (32 / params.batchSize) * 0.15;
  const train: number[] = [];
  const val: number[] = [];

  for (let epoch = 1; epoch <= params.epochs; epoch += 1) {
    if (diverged) {
      const blow = scenario.baseLoss * (1 + (params.learningRate / scenario.lrStableMax) * epoch * 0.35);
      train.push(round4(blow));
      val.push(round4(blow + 0.25));
      continue;
    }
    const progress = 1 - Math.exp(-params.learningRate * LR_GAIN * epoch);
    const trainLoss = floor + (scenario.baseLoss - floor) * (1 - progress) + noise;
    const overfitRate = params.method === "full" ? 0.35 : 0.08;
    const stepsPast = Math.max(0, epoch - scenario.overfitEpoch);
    const gap = stepsPast * (params.learningRate / scenario.lrStableMax) * overfitRate;
    let forgettingPenalty = 0;
    if (
      params.method === "full" &&
      scenario.forgettingEpoch !== null &&
      epoch >= scenario.forgettingEpoch
    ) {
      forgettingPenalty = (epoch - scenario.forgettingEpoch + 1) * 0.08;
    }
    train.push(round4(trainLoss));
    val.push(round4(trainLoss + gap + forgettingPenalty));
  }

  const finalTrain = train[train.length - 1] ?? scenario.baseLoss;
  const finalVal = val[val.length - 1] ?? scenario.baseLoss;
  const forgetting =
    !diverged &&
    params.method === "full" &&
    scenario.forgettingEpoch !== null &&
    params.epochs >= scenario.forgettingEpoch;

  return {
    train,
    val,
    diverged,
    forgetting,
    finalTrain,
    finalVal,
    gap: round4(finalVal - finalTrain),
  };
}

function round4(value: number): number {
  return Math.round(value * 10000) / 10000;
}

export interface CurveTargets {
  maxFinalValLoss: number;
  maxGap: number;
  forbidDivergence: boolean;
  forbidForgetting: boolean;
  requiredMethod: "full" | "lora" | null;
}

export function curveMeetsTargets(series: LossSeries, params: LossParams, targets: CurveTargets): boolean {
  if (targets.forbidDivergence && series.diverged) return false;
  if (targets.forbidForgetting && series.forgetting) return false;
  if (targets.requiredMethod && params.method !== targets.requiredMethod) return false;
  if (series.finalVal > targets.maxFinalValLoss) return false;
  if (series.gap > targets.maxGap + 1e-9) return false;
  return true;
}
