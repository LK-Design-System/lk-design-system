import React from 'react';
import {createRoot} from 'react-dom/client';
import {Input,SearchField,PasswordInput,NumberField,AutoComplete,TagInput,Button,Textarea} from '@lk-design-system/lds-core';
import {InputGroup,SearchableMultiSelect,PinInput} from '@lk-design-system/lds-product';
import {LdsProvider} from '@lk-design-system/lds-theme';

const options=[{value:'a',label:'합성 항목 A'},{value:'b',label:'합성 항목 B'}];
export const fieldCases=[
 ['input',()=> <Input label="일반 입력" defaultValue="합성 문서 제목" trailingButton={<button type="button">입력 보조 작업</button>}/>],
 ['search',()=> <SearchField label="검색 입력" defaultValue="합성 검색어"/>],
 ['password',()=> <PasswordInput label="비밀번호 입력" defaultValue="synthetic-only"/>],
 ['number',()=> <NumberField label="숫자 입력" defaultValue={3}/>],
 ['group',()=> <InputGroup label="접두사 입력" prefix="ID" suffix="개" defaultValue="12"/>],
 ['autocomplete',()=> <AutoComplete label="자동 완성 입력" options={options} defaultValue="합성"/>],
 ['tags',()=> <TagInput aria-label="태그 입력" defaultValue={['합성 태그']}/>],
 ['multi',()=> <SearchableMultiSelect label="복수 선택 입력" options={options} value={['a']}/>],
 ['invalid',()=> <Input label="오류 입력" defaultValue="수정할 합성 값" error="형식을 확인하세요"/>],
 ['readonly',()=> <Input label="읽기 전용 입력" value="선택 가능한 합성 값" readOnly/>],
 ['disabled',()=> <Input label="비활성 입력" defaultValue="비활성 합성 값" disabled/>],
];

export function FocusContractSurface(){
 const [scheme,setScheme]=React.useState('light');
 return <LdsProvider colorScheme={scheme} persist={false}>
  <main><header><h1>공통 포커스</h1><button type="button" onClick={()=>setScheme(scheme==='light'?'dark':'light')}>테마 바꾸기</button></header>
   <p>합성 데이터 · Tab으로 이동하여 표시 위치를 확인합니다.</p>
   <div className="focus-cases">{fieldCases.map(([name,render])=><section data-case={name} key={name}><h2>{name}</h2>{render()}</section>)}</div>
   <section data-case="fallback"><h2>독립 컨트롤</h2><Button>독립 버튼</Button> <a href="#focus-end">독립 링크</a> <button style={{outline:'none'}} type="button">인라인 outline 없음</button></section>
   <section data-case="custom"><h2>컨트롤별 간격</h2><button className="focus-inset" type="button">안쪽 포커스</button> <button className="focus-alternative" type="button">지정한 외곽선</button></section>
   <section data-case="orphan"><h2>프레임 없는 입력</h2><input data-lds-focus-target="" aria-label="프레임 없는 입력" defaultValue="기본 표시 유지"/></section>
   <section data-case="segments"><h2>개별 입력 경계</h2><Textarea label="여러 줄 입력" defaultValue="합성 여러 줄"/><PinInput aria-label="PIN 입력" length={4}/></section>
   <p id="focus-end">끝</p>
  </main>
 </LdsProvider>;
}

if(typeof document!=='undefined')createRoot(document.getElementById('focus-root')).render(<FocusContractSurface/>);
