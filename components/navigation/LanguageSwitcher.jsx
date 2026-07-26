import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Icon } from '../icon/Icon.jsx';
import { DropdownMenu } from '../overlay/DropdownMenu.jsx';

/**
 * Product-level language selection utility.
 *
 * LanguageSwitcher deliberately owns only the menu-button interaction and the
 * selected-locale presentation. Translation loading, routing, persistence,
 * formatting, and the document `lang` attribute remain application concerns.
 */
export function LanguageSwitcher({
  locales = [],
  value,
  onChange,
  ariaLabel = '언어 선택',
  align = 'right',
  onDark = false,
  disabled = false,
  style,
  ...rest
}) {
  const currentLocale = locales.find((locale) => locale.value === value);
  const hasAvailableAlternative = locales.some(
    (locale) => locale.value !== value && !locale.disabled,
  );
  const unavailable = disabled || !currentLocale || !hasAvailableAlternative;

  const items = locales.map((locale) => ({
    icon: (
      <span
        aria-hidden="true"
        data-language-switcher-indicator=""
        data-language-switcher-check={locale.value === value ? '' : undefined}
        style={{
          width: 16,
          height: 16,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          color: locale.disabled
            ? 'var(--color-semantic-label-disable)'
            : 'var(--color-semantic-primary-normal)',
        }}
      >
        {locale.value === value && (
          <Icon name="check" size={16} aria-hidden="true" />
        )}
      </span>
    ),
    iconPosition: 'end',
    label: (
      <span lang={locale.lang ?? locale.value} dir="auto">
        {locale.label}
      </span>
    ),
    checked: locale.value === value,
    disabled: disabled || locale.disabled,
    onClick: () => {
      if (locale.value === value || locale.disabled) return;
      onChange?.(locale.value, { locale });
    },
  }));

  return (
    <DropdownMenu
      data-language-switcher=""
      {...rest}
      align={align}
      variant="radio"
      items={items}
      style={style}
      trigger={(
        <IconButton
          data-language-switcher-trigger=""
          type="button"
          size={36}
          variant="plain"
          label={ariaLabel}
          title={ariaLabel}
          disabled={unavailable}
          style={onDark
            ? {
                '--viewer-foreground': 'var(--color-semantic-inverse-label)',
                color: unavailable
                  ? 'var(--color-semantic-inverse-label-disable-soft)'
                  : 'var(--color-semantic-inverse-label)',
              }
            : undefined}
        >
          <Icon
            data-language-switcher-icon=""
            name="globe"
            size={20}
            aria-hidden="true"
          />
        </IconButton>
      )}
    />
  );
}
