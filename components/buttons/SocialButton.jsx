import React from 'react';
import { BrandLogo } from '../brand/BrandLogo.jsx';

/**
 * LK ROBOTICS — SocialButton
 * "…로 계속하기" 소셜 로그인 버튼. 소셜 로그인 킷의 6개 심볼(Continue with
 * Google/Apple/Facebook × Centre/Left Aligned)을 provider × align prop으로
 * 통합하되, 지오메트리·타이포는 킷이 아니라 LK 컨트롤 문법을 따른다 —
 * 높이 52(=Button md) · var(--radius-md) · 16px/var(--fw-bold) ·
 * 토큰 모션(호버 뮤트 필, 프레스 scale 0.97).
 *
 * tone:
 * - 'outline' (기본, DS 네이티브) — 서피스 + 헤어라인 + 풀컬러 마크.
 *   시맨틱 토큰이라 다크 테마 자동 대응(애플 마크는 currentColor → 잉크).
 * - 'brand' — 킷의 플랫폼 원색 필 재현(구글 화이트+섀도 · 애플 블랙 ·
 *   페이스북 #1877F2). 플랫폼 강조가 필요할 때만.
 * 마크는 BrandLogo 재사용, 기본 카피는 KR("Google로 계속하기").
 */
export function SocialButton({
  provider = 'google',      // google | apple | facebook
  align = 'center',         // center | left  (킷의 Centre / Left Aligned)
  tone = 'outline',         // outline | brand
  iconOnly = false,         // 원형 아이콘 버튼(48px 서클) — 레퍼런스 킷의 소셜 아이콘 행
  full = false,
  disabled = false,
  as = 'button',
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  ...rest
}) {
  const [hover, setHover] = React.useState(false);
  const [press, setPress] = React.useState(false);

  const KIT_SHADOW = '0px 0px 3px 0px rgba(0,0,0,0.084), 0px 2px 3px 0px rgba(0,0,0,0.168)';
  const brandFills = {
    google:   { bg: 'rgb(255,255,255)', bgHover: 'rgb(248,248,248)', fg: 'rgba(0,0,0,0.54)', bd: 'none', shadow: KIT_SHADOW, mono: false },
    apple:    { bg: 'rgb(0,0,0)',       bgHover: 'rgb(0,0,0)',       fg: '#FFFFFF',          bd: 'none', shadow: KIT_SHADOW, mono: false },
    facebook: { bg: 'rgb(24,119,242)',  bgHover: 'rgb(24,119,242)',  fg: '#FFFFFF',          bd: 'none', shadow: 'none',     mono: true },
  };
  const outline = {
    bg: 'var(--surface-raised, #FFFFFF)', bgHover: 'var(--bw-mist)',
    fg: 'var(--label-normal)', bd: '1px solid var(--bw-border)',
    bdHover: '1px solid var(--bw-gray-300)', shadow: 'none', mono: false,
  };
  const labels = { google: 'Google로 계속하기', apple: 'Apple로 계속하기', facebook: 'Facebook으로 계속하기' };
  const p = tone === 'brand' ? (brandFills[provider] || brandFills.google) : outline;
  const active = !disabled;

  const composed = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: iconOnly ? 'center' : (align === 'left' ? 'flex-start' : 'center'),
    gap: iconOnly ? 0 : '9px',
    height: iconOnly ? '48px' : '52px',
    padding: iconOnly ? '0' : '0 20px',
    width: iconOnly ? '48px' : (full ? '100%' : undefined),
    flexShrink: iconOnly ? 0 : undefined,
    boxSizing: 'border-box',
    fontFamily: 'var(--font-sans)',
    fontSize: '16px',
    fontWeight: 'var(--fw-bold)',
    letterSpacing: '-0.3px',
    lineHeight: 1,
    color: p.fg,
    background: active && hover ? p.bgHover : p.bg,
    border: (active && hover && p.bdHover) ? p.bdHover : p.bd,
    borderRadius: iconOnly ? '999px' : 'var(--radius-md)',
    boxShadow: p.shadow,
    transform: press && active ? 'scale(0.97)' : 'none',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.45 : 1,
    transition: 'background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), transform var(--dur-base) var(--ease-out)',
    whiteSpace: 'nowrap',
    textDecoration: 'none',
    WebkitTapHighlightColor: 'transparent',
    ...style,
  };

  const Comp = as;
  const label = typeof children === 'string' ? children : labels[provider];
  return (
    <Comp
      className={`lk-social-btn lk-social-btn--${provider}`}
      style={composed}
      disabled={as === 'button' ? disabled : undefined}
      aria-label={iconOnly ? label : undefined}
      title={iconOnly ? label : undefined}
      onMouseEnter={(e) => { setHover(true); onMouseEnter && onMouseEnter(e); }}
      onMouseLeave={(e) => { setHover(false); setPress(false); onMouseLeave && onMouseLeave(e); }}
      onMouseDown={(e) => { setPress(true); onMouseDown && onMouseDown(e); }}
      onMouseUp={(e) => { setPress(false); onMouseUp && onMouseUp(e); }}
      {...rest}
    >
      <BrandLogo name={provider} size={iconOnly ? 22 : 20} mono={p.mono} decorative style={{ flexShrink: 0 }} />
      {!iconOnly && <span>{children ?? labels[provider]}</span>}
    </Comp>
  );
}
