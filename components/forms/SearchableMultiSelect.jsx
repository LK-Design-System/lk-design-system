import React from 'react';
import { IconButton } from '../buttons/IconButton.jsx';
import { Chip } from '../feedback/Chip.jsx';
import { Icon } from '../icon/Icon.jsx';

function optionText(option) {
  if (typeof option.label === 'string' || typeof option.label === 'number') return String(option.label);
  return String(option.value);
}

function optionDomId(listboxId, option) {
  return `${listboxId}-${encodeURIComponent(String(option.value))}`;
}

function firstEnabledIndex(options) {
  return options.findIndex((option) => !option.effectiveDisabled);
}

function moveEnabledIndex(options, currentIndex, direction) {
  const enabledIndexes = options.flatMap((option, index) => option.effectiveDisabled ? [] : [index]);
  if (enabledIndexes.length === 0) return -1;
  const currentPosition = enabledIndexes.indexOf(currentIndex);
  if (currentPosition < 0) return direction > 0 ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1];
  const nextPosition = Math.max(0, Math.min(enabledIndexes.length - 1, currentPosition + direction));
  return enabledIndexes[nextPosition];
}

/** Searchable multi-select with controlled values and removable selected chips. */
export function SearchableMultiSelect({
  options = [],
  value,
  defaultValue = [],
  onChange,
  searchValue,
  defaultSearchValue = '',
  onSearchChange,
  filterOption,
  label,
  placeholder = '검색해서 선택',
  loading = false,
  error,
  emptyLabel = '조건에 맞는 항목이 없습니다.',
  loadingLabel = '불러오는 중',
  maxSelections,
  maxSelectionLabel,
  disabled = false,
  style,
  ...rest
}) {
  const controlled = value !== undefined;
  const searchControlled = searchValue !== undefined;
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const [internalSearch, setInternalSearch] = React.useState(defaultSearchValue);
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const listboxId = React.useId();
  const inputId = React.useId();
  const errorId = React.useId();
  const statusId = React.useId();
  const inputRef = React.useRef(null);
  const selected = controlled ? value : internalValue;
  const search = searchControlled ? searchValue : internalSearch;
  const selectedSet = new Set(selected);
  const selectedOptions = selected.map((selectedValue) => options.find((option) => option.value === selectedValue) ?? { value: selectedValue, label: String(selectedValue) });
  const maxReached = maxSelections != null && selected.length >= maxSelections;
  const resolvedMaxLabel = maxSelectionLabel ?? `최대 ${maxSelections}개를 선택했습니다.`;
  const filteredOptions = options
    .filter((option) => filterOption
      ? filterOption(option, search)
      : [option.label, option.description, option.value].filter(Boolean).join(' ').toLowerCase().includes(String(search).trim().toLowerCase()))
    .map((option) => ({ ...option, effectiveDisabled: Boolean(option.disabled || (maxReached && !selectedSet.has(option.value))) }));
  const optionsKey = JSON.stringify(filteredOptions.map((option) => [option.value, option.effectiveDisabled]));
  const [activeIndex, setActiveIndex] = React.useState(() => firstEnabledIndex(filteredOptions));
  const activeOption = open && !loading && error == null && filteredOptions[activeIndex] && !filteredOptions[activeIndex].effectiveDisabled
    ? filteredOptions[activeIndex]
    : undefined;
  const popupStatus = loading
    ? loadingLabel
    : filteredOptions.length === 0
      ? emptyLabel
      : maxReached
        ? resolvedMaxLabel
        : '';

  React.useEffect(() => {
    setActiveIndex((index) => filteredOptions[index] && !filteredOptions[index].effectiveDisabled ? index : firstEnabledIndex(filteredOptions));
  }, [optionsKey]);

  const commit = (next) => {
    if (!controlled) setInternalValue(next);
    onChange?.(next);
  };

  const setSearch = (next) => {
    if (!searchControlled) setInternalSearch(next);
    onSearchChange?.(next);
    setActiveIndex(-1);
  };

  const toggle = (option) => {
    if (loading || error != null || option.disabled) return;
    if (selectedSet.has(option.value)) commit(selected.filter((item) => item !== option.value));
    else if (!maxReached) commit([...selected, option.value]);
    setOpen(true);
    inputRef.current?.focus();
  };

  const remove = (selectedValue) => {
    if (disabled) return;
    commit(selected.filter((item) => item !== selectedValue));
  };

  return (
    <div
      aria-busy={loading || undefined}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocused(false);
          setOpen(false);
        }
      }}
      style={{ position: 'relative', display: 'grid', gap: 'var(--component-input-stack-gap)', fontFamily: 'var(--font-sans)', ...style }}
      {...rest}
    >
      {label != null && (
        <label htmlFor={inputId} style={{ color: 'var(--component-input-label-color)', fontSize: 'var(--component-input-label-font-size)', lineHeight: 'var(--component-input-label-line-height)', fontWeight: 'var(--component-input-label-font-weight)' }}>
          {label}
        </label>
      )}

      <div
        onMouseDown={(event) => {
          if (event.target !== inputRef.current && !event.target.closest('button')) event.preventDefault();
          inputRef.current?.focus();
          if (!disabled) setOpen(true);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 'var(--space-1)',
          minHeight: 'var(--component-input-height)',
          padding: 'var(--space-2) var(--component-input-padding-x)',
          boxSizing: 'border-box',
          border: `var(--component-input-border-width) solid ${error != null ? 'var(--component-input-border-color-invalid)' : focused ? 'var(--component-input-border-color-focus)' : 'var(--component-input-border-color)'}`,
          borderRadius: 'var(--component-input-radius)',
          background: disabled ? 'var(--color-semantic-fill-normal)' : 'var(--component-input-bg)',
          boxShadow: focused && error == null ? 'var(--component-input-focus-shadow)' : 'none',
          cursor: disabled ? 'not-allowed' : 'text',
        }}
      >
        {selectedOptions.map((option) => (
          <Chip key={String(option.value)} size="sm" variant="outlined" disabled={disabled} style={{ paddingRight: 'var(--space-0)' }}>
            <span>{option.label}</span>
            <IconButton
              variant="soft"
              round={false}
              size={24}
              label={`${optionText(option)} 선택 해제`}
              disabled={disabled}
              onClick={() => remove(option.value)}
              style={{ background: 'transparent' }}
            >
              <Icon name="close" size={14} aria-hidden="true" />
            </IconButton>
          </Chip>
        ))}
        <input
          ref={inputRef}
          id={inputId}
          value={search}
          placeholder={maxReached && !search ? `최대 ${maxSelections}개 선택됨` : placeholder}
          disabled={disabled}
          role="combobox"
          aria-expanded={open && error == null}
          aria-controls={open && error == null ? listboxId : undefined}
          aria-autocomplete="list"
          aria-activedescendant={activeOption ? optionDomId(listboxId, activeOption) : undefined}
          aria-invalid={error != null || undefined}
          aria-describedby={[error != null ? errorId : null, popupStatus ? statusId : null].filter(Boolean).join(' ') || undefined}
          onFocus={() => { setFocused(true); setOpen(true); }}
          onChange={(event) => { setSearch(event.target.value); setOpen(true); }}
          onKeyDown={(event) => {
            if (event.key === 'ArrowDown') { event.preventDefault(); setOpen(true); setActiveIndex((index) => moveEnabledIndex(filteredOptions, index, 1)); }
            if (event.key === 'ArrowUp') { event.preventDefault(); setOpen(true); setActiveIndex((index) => moveEnabledIndex(filteredOptions, index, -1)); }
            if (event.key === 'Enter' && open && activeOption) { event.preventDefault(); toggle(activeOption); }
            if (event.key === 'Escape') { event.preventDefault(); setOpen(false); }
            if (event.key === 'Backspace' && !search && selected.length > 0) { event.preventDefault(); remove(selected[selected.length - 1]); }
          }}
          style={{ flex: '1 1 8rem', minWidth: 96, height: 28, padding: 0, border: 0, outline: 0, background: 'transparent', color: disabled ? 'var(--color-semantic-label-disable)' : 'var(--component-input-text-color)', fontFamily: 'var(--font-sans)', fontSize: 'var(--component-input-font-size)', lineHeight: 'var(--component-input-line-height)' }}
        />
      </div>

      {error != null && <span id={errorId} role="alert" style={{ color: 'var(--color-semantic-status-negative-text)', fontSize: 'var(--caption1-size)', lineHeight: 'var(--caption1-line)' }}>{error}</span>}
      <span
        id={statusId}
        role="status"
        aria-live="polite"
        style={{ position: 'absolute', width: 1, height: 1, padding: 0, margin: -1, overflow: 'hidden', clip: 'rect(0, 0, 0, 0)', whiteSpace: 'nowrap', border: 0 }}
      >
        {open ? popupStatus : ''}
      </span>

      {open && !disabled && error == null && (
        <div id={listboxId} role="listbox" aria-multiselectable="true" style={{ position: 'absolute', zIndex: 40, left: 0, right: 0, top: 'calc(100% + 6px)', maxHeight: 260, overflowY: 'auto', padding: 6, display: 'flex', flexDirection: 'column', gap: 2, border: '1px solid var(--color-semantic-line-solid-normal)', borderRadius: 'var(--radius-lg)', background: 'var(--color-semantic-surface-overlay)', boxShadow: 'var(--shadow-md)' }}>
          {loading || filteredOptions.length === 0 ? (
            <div role="option" aria-selected="false" aria-disabled="true" style={{ padding: 'var(--space-4)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--label1-size)', textAlign: 'center' }}>
              {loading ? loadingLabel : emptyLabel}
            </div>
          ) : filteredOptions.map((option, index) => {
            const selectedOption = selectedSet.has(option.value);
            return (
              <div
                id={optionDomId(listboxId, option)}
                key={String(option.value)}
                role="option"
                aria-selected={selectedOption}
                aria-disabled={option.effectiveDisabled || undefined}
                onMouseDown={(event) => event.preventDefault()}
                onMouseEnter={() => { if (!option.effectiveDisabled) setActiveIndex(index); }}
                onClick={() => toggle(option)}
                style={{ display: 'grid', gridTemplateColumns: '18px minmax(0, 1fr)', alignItems: 'center', gap: 'var(--space-2)', width: '100%', padding: 'var(--space-2) var(--space-3)', borderRadius: 'var(--radius-md)', background: index === activeIndex ? 'var(--color-semantic-fill-alternative)' : 'transparent', color: option.effectiveDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-normal)', textAlign: 'left', cursor: option.effectiveDisabled ? 'not-allowed' : 'pointer', fontFamily: 'inherit', boxSizing: 'border-box' }}
              >
                <span aria-hidden="true" style={{ display: 'grid', placeItems: 'center', width: 18, height: 18, boxSizing: 'border-box', border: `1.5px solid ${selectedOption ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-line-solid-normal)'}`, borderRadius: 'var(--radius-5)', background: selectedOption ? 'var(--color-semantic-primary-normal)' : 'var(--color-semantic-background-elevated-normal)', color: 'var(--color-semantic-static-white)' }}>
                  {selectedOption && <Icon name="check" size={12} aria-hidden="true" />}
                </span>
                <span style={{ display: 'grid', gap: 'var(--space-1)', minWidth: 0 }}>
                  <span style={{ fontSize: 'var(--label1-size)', fontWeight: 'var(--fw-semibold)' }}>{option.label}</span>
                  {option.description != null && <span style={{ color: option.effectiveDisabled ? 'var(--color-semantic-label-disable)' : 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{option.description}</span>}
                </span>
              </div>
            );
          })}
          {maxReached && <div role="option" aria-selected="false" aria-disabled="true" style={{ padding: 'var(--space-2) var(--space-3)', color: 'var(--color-semantic-label-neutral)', fontSize: 'var(--caption1-size)' }}>{resolvedMaxLabel}</div>}
        </div>
      )}
    </div>
  );
}
