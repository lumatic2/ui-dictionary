/**
 * 종횡비 판정 — 생성 이미지를 슬롯에 cover로 채울 때 **얼마나 잘려나가는가**로 본다.
 *
 * 왜 종횡비 차이 자체를 임계로 삼지 않는가: 종횡비 차이 0.2가 어느 정도 손해인지는
 * 숫자만 봐서 설명되지 않는다. 반면 "원본의 32%가 잘린다"는 바로 판단된다.
 * 그래서 임계를 **잘림 비율**로 정의한다 — 규칙이 설명 가능해야 사후에 조정도 근거를 갖는다.
 *
 * cover 규칙: 슬롯을 빈틈없이 덮도록 확대한 뒤 넘치는 쪽을 자른다. 짧은 축이 기준이 되고,
 * 긴 축에서만 잘림이 생긴다. 렌더는 기존 `node.fit`(objectFit cover)이 그대로 수행한다 —
 * 여기서는 **받아들일지 거부할지**만 정한다(이미지 리사이즈 의존성을 들이지 않는다).
 */

/** cover로 채울 때 원본에서 잘려나가는 면적 비율(0~1). */
export function coverCropLoss(
  source: { width: number; height: number },
  slot: { width: number; height: number },
): number {
  if (source.width <= 0 || source.height <= 0 || slot.width <= 0 || slot.height <= 0) {
    throw new RangeError('치수는 양수여야 합니다.')
  }
  const sourceAspect = source.width / source.height
  const slotAspect = slot.width / slot.height
  // 종횡비가 같으면 잘림이 없다. 다르면 넓은 쪽 비율만큼 한 축이 잘린다.
  const ratio = sourceAspect > slotAspect ? slotAspect / sourceAspect : sourceAspect / slotAspect
  return 1 - ratio
}

/**
 * 허용 잘림 한도. 원본의 3분의 1 이상이 사라지면 "그 이미지를 쓴 것"이라 보기 어렵다 —
 * 피사체가 프레임 밖으로 나가고 생성 프롬프트의 의도가 남지 않는다.
 *
 * 근거는 관례가 아니라 이 판단이다. 실사용에서 과하거나 모자라면 근거를 적고 조정한다.
 */
export const MAX_COVER_CROP_LOSS = 1 / 3

export function fitsSlot(
  source: { width: number; height: number },
  slot: { width: number; height: number },
): boolean {
  return coverCropLoss(source, slot) <= MAX_COVER_CROP_LOSS
}
