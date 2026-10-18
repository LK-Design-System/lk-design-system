import React from 'react';
import {createRoot} from 'react-dom/client';
// These are authoring sources, deliberately not the generated package mirrors.
import {Input} from '../../../components/forms/Input.jsx';
import {PasswordInput} from '../../../components/forms/PasswordInput.jsx';
import {SearchField} from '../../../components/forms/SearchField.jsx';
import {Textarea} from '../../../components/forms/Textarea.jsx';
import {LdsProvider} from '../../../components/selection/LdsProvider.jsx';

export const fieldCases = ['input', 'password'].flatMap(kind => [
  ['normal', {}], ['invalid', {error: '형식을 확인하세요'}],
  ['readonly', {readOnly: true}], ['disabled', {disabled: true}],
].map(([state, props]) => [kind, state, props]));

export function FocusField({kind, state, props}) {
  const Field = kind === 'input' ? Input : PasswordInput;
  return <Field label={`${kind} ${state}`} defaultValue="synthetic-only" className="consumer-native"
    {...props} {...(kind === 'input' ? {trailingButton: <button type="button">입력 보조 작업</button>} : {})} />;
}

export function InputFocusSurface() {
  const [scheme, setScheme] = React.useState('light');
  return <LdsProvider colorScheme={scheme} persist={false}>
    <main><button type="button" onClick={() => setScheme(scheme === 'light' ? 'dark' : 'light')}>테마 바꾸기</button>
      <div className="input-focus-cases">{fieldCases.map(([kind, state, props]) =>
        <section key={`${kind}-${state}`} data-case={`${kind}-${state}`}>
          <FocusField kind={kind} state={state} props={props} />
        </section>)}</div>
      <section data-case="search"><SearchField label="search normal" defaultValue="synthetic-only" /></section>
      <section data-case="textarea"><Textarea label="textarea normal" defaultValue="synthetic-only" /></section>
      <section data-case="standalone"><label>standalone<input aria-label="standalone" defaultValue="synthetic-only" /></label>
        <button type="button">독립 버튼</button><button type="button" style={{outline: 'none'}}>인라인 outline 없음</button></section>
    </main>
  </LdsProvider>;
}

if (typeof document !== 'undefined') createRoot(document.getElementById('focus-root')).render(<InputFocusSurface />);
