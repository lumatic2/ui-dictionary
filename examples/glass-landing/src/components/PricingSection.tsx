const CheckIcon = ({ accent = false }: { accent?: boolean }) => (
  <svg viewBox="0 0 10 10" fill="none" style={{ width: 10, height: 10, flexShrink: 0 }}>
    <path
      d="M2 5.2L4 7.2L8 3"
      stroke={accent ? 'oklch(55% 0.18 280)' : 'oklch(45% 0.04 250)'}
      strokeWidth={accent ? '1.5' : '1.4'}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 10 10" fill="none" style={{ width: 10, height: 10, flexShrink: 0 }}>
    <path d="M3 3L7 7M7 3L3 7" stroke="oklch(65% 0.04 250)" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

type Feature = { text: string; muted?: boolean };

type Plan = {
  badge: string;
  badgeAccent: boolean;
  name: string;
  desc: string;
  price: string;
  priceSuffix?: string;
  period?: string;
  features: Feature[];
  cta: string;
  featured?: boolean;
};

const plans: Plan[] = [
  {
    badge: 'Starter',
    badgeAccent: false,
    name: '무료',
    desc: '개인 프로젝트나 소규모 실험에\n완벽한 시작점',
    price: '₩0',
    period: '/ 월',
    features: [
      { text: '기본 컴포넌트 10개' },
      { text: '색상 토큰 5개' },
      { text: '커뮤니티 지원' },
      { text: '1인 사용자' },
      { text: '팀 협업', muted: true },
      { text: '버전 히스토리', muted: true },
    ],
    cta: '무료로 시작하기',
  },
  {
    badge: 'Most Popular',
    badgeAccent: true,
    name: 'Pro',
    desc: '성장하는 팀을 위한\n완전한 디자인 시스템',
    price: '29,000',
    priceSuffix: '₩',
    period: '/ 월',
    features: [
      { text: '모든 컴포넌트 무제한' },
      { text: '색상 · 타입 토큰 무제한' },
      { text: '우선 이메일 지원' },
      { text: '최대 10인 팀 협업' },
      { text: '버전 히스토리 90일' },
      { text: '7-stage 자동 검증' },
    ],
    cta: '14일 무료 체험 →',
    featured: true,
  },
  {
    badge: 'Enterprise',
    badgeAccent: false,
    name: '맞춤 견적',
    desc: '대규모 조직을 위한\n전담 관리 솔루션',
    price: '문의하기',
    features: [
      { text: 'Pro 모든 기능 포함' },
      { text: '맞춤형 컴포넌트 개발' },
      { text: 'SSO / SAML 연동' },
      { text: '99.9% SLA 보장' },
      { text: '전담 Customer Success' },
      { text: '온프레미스 배포 옵션' },
    ],
    cta: '영업팀에 문의하기',
  },
];

export function PricingSection() {
  return (
    <section className="px-6 pb-28">
      <div className="mx-auto max-w-[1040px] mb-[52px] text-center">
        <span
          className="inline-block text-xs font-semibold tracking-[0.1em] uppercase rounded-full px-3.5 py-1 mb-4.5"
          style={{
            color: 'var(--color-iris-500)',
            background: 'oklch(70% 0.16 280 / 0.10)',
            border: '1px solid oklch(70% 0.16 280 / 0.25)',
          }}
        >
          Pricing
        </span>
        <h2 className="text-[44px] font-semibold tracking-[-0.005em] leading-[1.1] mb-3.5">
          당신의 팀에 맞는 플랜
        </h2>
        <p className="text-base text-(--color-text-muted) leading-relaxed">
          모든 플랜은 14일 무료 체험을 제공합니다.<br />언제든지 업그레이드하거나 취소할 수 있어요.
        </p>
      </div>

      <div className="mx-auto flex justify-center gap-4 flex-wrap">
        {plans.map((plan) => (
          <div
            key={plan.name}
            className={`${plan.featured ? 'glass-plan-featured' : 'glass-card'} rounded-[24px] flex flex-col overflow-hidden transition-transform duration-[400ms]`}
            style={{ width: 300 }}
          >
            {plan.featured && (
              <div
                className="h-[3px] rounded-t-[24px]"
                style={{ background: 'linear-gradient(90deg, var(--color-iris-400), var(--color-iris-500), var(--color-iris-700))' }}
              />
            )}
            <div className="flex flex-col flex-1 gap-6 p-7 pb-8">
              <span
                className="self-start text-[11px] font-semibold tracking-[0.06em] uppercase rounded-full px-2.5 py-0.5"
                style={
                  plan.badgeAccent
                    ? {
                        background: 'oklch(55% 0.18 280 / 0.12)',
                        color: 'var(--color-iris-500)',
                        border: '1px solid oklch(70% 0.16 280 / 0.25)',
                      }
                    : {
                        background: 'oklch(55% 0.04 250 / 0.08)',
                        color: 'var(--color-text-muted)',
                        border: '1px solid var(--color-border-default)',
                      }
                }
              >
                {plan.badge}
              </span>

              <div className="flex flex-col gap-2">
                <div className="text-[28px] font-semibold tracking-[-0.005em]">{plan.name}</div>
                <p className="text-[13px] text-(--color-text-muted) leading-[1.5] whitespace-pre-line">{plan.desc}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  {plan.priceSuffix && (
                    <span className="text-[20px] font-medium text-(--color-text-muted)" style={{ alignSelf: 'flex-start', marginTop: 6 }}>
                      {plan.priceSuffix}
                    </span>
                  )}
                  <span
                    className="text-[38px] font-semibold tracking-[-0.02em] leading-none"
                    style={plan.featured ? { color: 'var(--color-iris-500)' } : undefined}
                  >
                    {plan.price}
                  </span>
                  {plan.period && (
                    <span className="text-[13px] text-(--color-text-muted) ml-0.5">{plan.period}</span>
                  )}
                </div>
              </div>

              <div
                className="h-px"
                style={{
                  background: plan.featured
                    ? 'linear-gradient(90deg, transparent, oklch(55% 0.18 280 / 0.18) 30%, oklch(55% 0.18 280 / 0.18) 70%, transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(0,0,0,0.06) 30%, rgba(0,0,0,0.06) 70%, transparent)',
                }}
              />

              <ul className="flex flex-col gap-2.5 flex-1">
                {plan.features.map((f) => (
                  <li
                    key={f.text}
                    className="flex items-start gap-2.5 text-[13.5px] leading-[1.4]"
                    style={f.muted ? { color: 'var(--color-text-muted)', textDecoration: 'line-through', opacity: 0.5 } : undefined}
                  >
                    <span
                      className="w-[18px] h-[18px] rounded-full flex items-center justify-center mt-[1px]"
                      style={
                        f.muted
                          ? { border: '1px solid var(--color-border-default)' }
                          : plan.featured
                          ? { background: 'oklch(70% 0.16 280 / 0.18)' }
                          : { background: 'oklch(94% 0.02 250)' }
                      }
                    >
                      {f.muted ? <XIcon /> : <CheckIcon accent={plan.featured} />}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <a
                href="#"
                className={`${plan.featured ? 'glass-btn-primary' : 'glass-btn'} flex items-center justify-center w-full px-[22px] py-[13px] rounded-full text-sm font-medium no-underline`}
                style={{ fontFamily: 'inherit' }}
              >
                {plan.cta}
              </a>
            </div>
          </div>
        ))}
      </div>

      <p className="text-center mt-8 text-[13px] text-(--color-text-muted) leading-relaxed">
        모든 가격은 VAT 별도입니다.&nbsp;&nbsp;연간 결제 시 <strong>20% 할인</strong> 제공.<br />
        궁금한 점이 있으신가요?{' '}
        <a
          href="#"
          className="no-underline"
          style={{ color: 'var(--color-iris-500)', borderBottom: '1px solid oklch(55% 0.18 280 / 0.3)' }}
        >
          자주 묻는 질문
        </a>
        을 확인하세요.
      </p>
    </section>
  );
}
