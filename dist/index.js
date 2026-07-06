// components/brand/BrandLogo.jsx
import React from "react";
var LOGOS = { "apple": { "viewBox": "0 0 24 24", "body": '<path d="M 5.381 21.346 C 6.662 21.346 7.224 20.458 8.819 20.458 C 10.414 20.458 10.796 21.312 12.212 21.312 C 13.627 21.312 14.537 19.986 15.425 18.683 C 16.414 17.189 16.818 15.728 16.852 15.661 C 16.762 15.639 14.088 14.504 14.088 11.347 C 14.088 8.606 16.2 7.37 16.313 7.28 C 14.919 5.213 12.796 5.168 12.223 5.168 C 10.662 5.168 9.381 6.145 8.572 6.145 C 7.707 6.145 6.561 5.224 5.202 5.224 C 2.618 5.224 0 7.426 0 11.572 C 0 14.144 0.977 16.874 2.168 18.638 C 3.191 20.132 4.089 21.357 5.381 21.357 L 5.381 21.346 Z M 8.673 4.921 C 9.606 4.921 10.785 4.269 11.482 3.404 C 12.111 2.618 12.571 1.517 12.571 0.416 C 12.571 0.27 12.56 0.112 12.526 0 C 11.482 0.045 10.235 0.719 9.482 1.629 C 8.887 2.326 8.347 3.404 8.347 4.516 C 8.347 4.674 8.37 4.842 8.392 4.898 C 8.46 4.91 8.561 4.921 8.673 4.921 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 3.574 0.602)"/>' }, "facebook": { "viewBox": "0 0 24 24", "body": '<path d="M 19.8 9.9 C 19.8 15.368 15.368 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.368 0 19.8 4.432 19.8 9.9 Z" fill="rgb(8,102,255)" fill-rule="nonzero" transform="matrix(1 0 0 1 2.100 2.100)"/><path d="M 5.613 15.808 L 5.613 8.9 L 7.92 8.9 L 8.356 6.039 L 5.613 6.039 L 5.613 4.178 C 5.613 3.396 5.999 2.633 7.227 2.633 L 8.474 2.633 L 8.474 0.198 C 8.474 0.198 7.336 0 6.257 0 C 3.99 0 2.515 1.366 2.515 3.851 L 2.515 6.029 L 0 6.029 L 0 8.89 L 2.515 8.89 L 2.515 15.809 C 3.018 15.888 3.534 15.929 4.059 15.929 C 4.588 15.929 5.107 15.888 5.613 15.808 Z" fill="rgb(255,255,255)" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100) matrix(1 0 0 1 5.841 3.871)"/>' }, "google": { "viewBox": "0 0 24 24", "body": '<path d="M 9.504 2.025 C 9.504 1.323 9.441 0.648 9.324 0 L 0 0 L 0 3.829 L 5.328 3.829 C 5.098 5.067 4.401 6.116 3.353 6.818 L 3.353 9.302 L 6.552 9.302 C 8.424 7.578 9.504 5.04 9.504 2.025 Z" fill="rgb(61,130,240)" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100) matrix(1 0 0 1 9.900 8.100)"/><path d="M 8.847 8.019 C 11.52 8.019 13.761 7.132 15.399 5.621 L 12.2 3.136 C 11.313 3.73 10.179 4.081 8.847 4.081 C 6.269 4.081 4.086 2.34 3.308 0 L 0 0 L 0 2.565 C 1.629 5.8 4.977 8.019 8.847 8.019 Z" fill="rgb(49,167,82)" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100) matrix(1 0 0 1 1.053 11.781)"/><path d="M 4.36 6.327 C 4.162 5.733 4.05 5.099 4.05 4.446 C 4.05 3.794 4.162 3.159 4.36 2.565 L 4.36 0 L 1.053 0 C 0.383 1.337 0 2.849 0 4.446 C 0 6.043 0.383 7.556 1.053 8.892 L 4.36 6.327 Z" fill="rgb(249,186,0)" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100) matrix(1 0 0 1 0 5.454)"/><path d="M 8.847 3.938 C 10.3 3.938 11.606 4.437 12.631 5.419 L 15.471 2.58 C 13.757 0.981 11.516 0 8.847 0 C 4.977 0 1.629 2.219 0 5.455 L 3.308 8.019 C 4.086 5.679 6.269 3.938 8.847 3.938 Z" fill="rgb(230,66,52)" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100) matrix(1 0 0 1 1.053 0)"/>' } };
Object.assign(LOGOS, {
  "github": { viewBox: "0 0 24 24", body: '<path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="currentColor"/>' },
  "huggingface": { viewBox: "0 0 24 24", body: '<path d="M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022q-.094.03-.216.087-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096 3 3 0 0 0-.26.219 2 2 0 0 0-.12.121 2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203 0-.334.109-.457.305-.454m.836 10.354c.824-1.19.766-2.082-.365-3.194-1.13-1.112-1.789-2.738-1.789-2.738s-.246-.945-.806-.858-.97 1.499.202 2.362c1.173.864-.233 1.45-.685.64-.45-.812-1.683-2.896-2.322-3.295s-1.089-.175-.938.647 2.822 2.813 2.562 3.244-1.176-.506-1.176-.506-2.866-2.567-3.49-1.898.473 1.23 2.037 2.16c1.564.932 1.686 1.178 1.464 1.53s-3.675-2.511-4-1.297c-.323 1.214 3.524 1.567 3.287 2.405-.238.839-2.71-1.587-3.216-.642-.506.946 3.49 2.056 3.522 2.064 1.29.33 4.568 1.028 5.713-.624m5.349 0c-.824-1.19-.766-2.082.365-3.194 1.13-1.112 1.789-2.738 1.789-2.738s.246-.945.806-.858.97 1.499-.202 2.362c-1.173.864.233 1.45.685.64.451-.812 1.683-2.896 2.322-3.295s1.089-.175.938.647-2.822 2.813-2.562 3.244 1.176-.506 1.176-.506 2.866-2.567 3.49-1.898-.473 1.23-2.037 2.16c-1.564.932-1.686 1.178-1.464 1.53s3.675-2.511 4-1.297c.323 1.214-3.524 1.567-3.287 2.405.238.839 2.71-1.587 3.216-.642.506.946-3.49 2.056-3.522 2.064-1.29.33-4.568 1.028-5.713-.624" fill="#FFD21E"/><path d="M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022q-.094.03-.216.087-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096 3 3 0 0 0-.26.219 2 2 0 0 0-.12.121 2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203 0-.334.109-.457.305-.454" fill="#3A3B45"/><path d="M5.134 8.133a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92M18.972 8.133a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92" fill="#FF9D0B"/>' },
  "linkedin": { viewBox: "0 0 24 24", body: '<path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" fill="#0A66C2"/><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z" fill="#FFFFFF"/>' },
  "x": { viewBox: "0 0 24 24", body: '<path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" fill="currentColor"/>' },
  "youtube": { viewBox: "0 0 24 24", body: '<path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814z" fill="#FF0000"/><path d="M9.545 15.568V8.432L15.818 12l-6.273 3.568z" fill="#FFFFFF"/>' }
});
var BRAND_LOGO_NAMES = ["apple", "facebook", "google", "github", "huggingface", "linkedin", "x", "youtube"];
var MONO = {
  facebook: "M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.686 1.686 0 0 0-.679.622c-.258.42-.374.995-.374 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z",
  huggingface: "M12.025 1.13c-5.77 0-10.449 4.647-10.449 10.378 0 1.112.178 2.181.503 3.185.064-.222.203-.444.416-.577a.96.96 0 0 1 .524-.15c.293 0 .584.124.84.284.278.173.48.408.71.694.226.282.458.611.684.951v-.014c.017-.324.106-.622.264-.874s.403-.487.762-.543c.3-.047.596.06.787.203s.31.313.4.467c.15.257.212.468.233.542.01.026.653 1.552 1.657 2.54.616.605 1.01 1.223 1.082 1.912.055.537-.096 1.059-.38 1.572.637.121 1.294.187 1.967.187.657 0 1.298-.063 1.921-.178-.287-.517-.44-1.041-.384-1.581.07-.69.465-1.307 1.081-1.913 1.004-.987 1.647-2.513 1.657-2.539.021-.074.083-.285.233-.542.09-.154.208-.323.4-.467a1.08 1.08 0 0 1 .787-.203c.359.056.604.29.762.543s.247.55.265.874v.015c.225-.34.457-.67.683-.952.23-.286.432-.52.71-.694.257-.16.547-.284.84-.285a.97.97 0 0 1 .524.151c.228.143.373.388.43.625l.006.04a10.3 10.3 0 0 0 .534-3.273c0-5.731-4.678-10.378-10.449-10.378M8.327 6.583a1.5 1.5 0 0 1 .713.174 1.487 1.487 0 0 1 .617 2.013c-.183.343-.762-.214-1.102-.094-.38.134-.532.914-.917.71a1.487 1.487 0 0 1 .69-2.803m7.486 0a1.487 1.487 0 0 1 .689 2.803c-.385.204-.536-.576-.916-.71-.34-.12-.92.437-1.103.094a1.487 1.487 0 0 1 .617-2.013 1.5 1.5 0 0 1 .713-.174m-10.68 1.55a.96.96 0 1 1 0 1.921.96.96 0 0 1 0-1.92m13.838 0a.96.96 0 1 1 0 1.92.96.96 0 0 1 0-1.92M8.489 11.458c.588.01 1.965 1.157 3.572 1.164 1.607-.007 2.984-1.155 3.572-1.164.196-.003.305.12.305.454 0 .886-.424 2.328-1.563 3.202-.22-.756-1.396-1.366-1.63-1.32q-.011.001-.02.006l-.044.026-.01.008-.03.024q-.018.017-.035.036l-.032.04a1 1 0 0 0-.058.09l-.014.025q-.049.088-.11.19a1 1 0 0 1-.083.116 1.2 1.2 0 0 1-.173.18q-.035.029-.075.058a1.3 1.3 0 0 1-.251-.243 1 1 0 0 1-.076-.107c-.124-.193-.177-.363-.337-.444-.034-.016-.104-.008-.2.022q-.094.03-.216.087-.06.028-.125.063l-.13.074q-.067.04-.136.086a3 3 0 0 0-.135.096 3 3 0 0 0-.26.219 2 2 0 0 0-.12.121 2 2 0 0 0-.106.128l-.002.002a2 2 0 0 0-.09.132l-.001.001a1.2 1.2 0 0 0-.105.212q-.013.036-.024.073c-1.139-.875-1.563-2.317-1.563-3.203 0-.334.109-.457.305-.454m.836 10.354c.824-1.19.766-2.082-.365-3.194-1.13-1.112-1.789-2.738-1.789-2.738s-.246-.945-.806-.858-.97 1.499.202 2.362c1.173.864-.233 1.45-.685.64-.45-.812-1.683-2.896-2.322-3.295s-1.089-.175-.938.647 2.822 2.813 2.562 3.244-1.176-.506-1.176-.506-2.866-2.567-3.49-1.898.473 1.23 2.037 2.16c1.564.932 1.686 1.178 1.464 1.53s-3.675-2.511-4-1.297c-.323 1.214 3.524 1.567 3.287 2.405-.238.839-2.71-1.587-3.216-.642-.506.946 3.49 2.056 3.522 2.064 1.29.33 4.568 1.028 5.713-.624m5.349 0c-.824-1.19-.766-2.082.365-3.194 1.13-1.112 1.789-2.738 1.789-2.738s.246-.945.806-.858.97 1.499-.202 2.362c-1.173.864.233 1.45.685.64.451-.812 1.683-2.896 2.322-3.295s1.089-.175.938.647-2.822 2.813-2.562 3.244 1.176-.506 1.176-.506 2.866-2.567 3.49-1.898-.473 1.23-2.037 2.16c-1.564.932-1.686 1.178-1.464 1.53s3.675-2.511 4-1.297c.323 1.214-3.524 1.567-3.287 2.405.238.839 2.71-1.587 3.216-.642.506.946-3.49 2.056-3.522 2.064-1.29.33-4.568 1.028-5.713-.624",
  linkedin: "M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z",
  youtube: "M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z",
  google: "M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
};
function BrandLogo({ name, size = 24, title, mono = false, decorative = false, style, ...rest }) {
  const g = LOGOS[name];
  if (!g) return React.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", style, ...rest });
  let body = g.body;
  if (mono) {
    body = MONO[name] ? '<path d="' + MONO[name] + '" fill="currentColor"/>' : g.body.replace(/fill="(#[0-9A-Fa-f]{3,8}|rgb\([^)]*\))"/g, 'fill="currentColor"');
  }
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title || name + " logo" };
  return React.createElement("svg", {
    width: size,
    height: size,
    viewBox: g.viewBox,
    ...a11y,
    style: { display: "block", flexShrink: 0, ...style },
    dangerouslySetInnerHTML: { __html: body },
    ...rest
  });
}

// components/brand/Lockup.jsx
import React2 from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var LK_D = "M1938 3103 l2 -703 248 0 247 0 101 -123 c56 -67 125 -150 154 -184 l52 -63 -596 0 -596 0 0 890 0 890 193 -2 192 -3 3 -702z M3470 3795 c0 -3 -155 -212 -346 -466 -190 -253 -347 -466 -350 -473 -3 -7 152 -195 345 -420 193 -224 351 -409 351 -412 0 -2 -112 -4 -248 -4 l-248 0 -347 410 c-191 225 -347 414 -347 420 0 6 170 222 377 480 l378 470 217 0 c120 0 218 -2 218 -5z";
var ROBO_D = "M4120 1630 c20 -5 45 -16 55 -24 19 -13 18 -15 -9 -55 -31 -45 -39 -47 -76 -26 -32 18 -71 19 -96 1 -15 -12 -17 -18 -8 -33 11 -18 27 -25 103 -44 27 -6 58 -24 78 -44 28 -28 33 -40 33 -83 0 -58 -23 -93 -81 -122 -63 -33 -185 -21 -255 25 l-25 16 31 39 31 39 42 -19 c72 -33 137 -23 137 21 0 18 -29 30 -100 44 -84 17 -120 59 -120 139 0 36 6 52 28 76 47 53 147 74 232 50z M1545 1619 c68 -17 131 -78 151 -145 44 -151 -60 -284 -220 -284 -138 1 -226 87 -226 219 0 156 134 251 295 210z M2540 1620 c49 -13 109 -66 131 -114 24 -53 24 -139 0 -192 -70 -155 -321 -165 -408 -16 -40 67 -40 157 -1 224 53 89 167 129 278 98z M3752 1598 c24 -13 43 -28 43 -33 0 -6 -12 -26 -27 -45 -24 -30 -30 -33 -45 -22 -47 33 -84 43 -119 32 -113 -38 -113 -202 0 -240 36 -12 77 -2 108 27 15 14 21 12 57 -18 22 -19 41 -37 41 -41 0 -16 -78 -58 -122 -66 -109 -21 -213 26 -261 118 -24 45 -28 64 -25 106 8 92 65 167 154 200 54 20 142 12 196 -18z M1107 1599 c58 -28 80 -72 75 -147 -1 -12 -20 -40 -42 -61 l-41 -40 34 -48 c19 -26 42 -60 52 -75 l17 -28 -63 0 -64 0 -45 70 c-38 58 -49 70 -72 70 l-28 0 0 -75 0 -75 -55 0 -55 0 0 215 0 215 122 0 c103 0 128 -3 165 -21z M2085 1605 c33 -16 55 -50 55 -86 0 -28 -26 -75 -45 -83 -13 -5 -7 -14 26 -46 40 -38 41 -42 36 -86 -3 -32 -13 -54 -31 -73 -26 -26 -29 -26 -186 -29 l-160 -3 0 210 0 211 136 0 c102 0 144 -4 169 -15z M3130 1575 l0 -44 -72 -3 -73 -3 -3 -167 -2 -168 -55 0 -55 0 0 170 0 170 -65 0 -65 0 0 45 0 45 195 0 195 0 0 -45z M3320 1405 l0 -215 -55 0 -55 0 0 215 0 215 55 0 55 0 0 -215z M1443 1533 c-12 -2 -36 -20 -53 -39 -25 -29 -30 -43 -30 -88 0 -38 6 -61 20 -78 45 -58 129 -61 174 -7 79 93 5 233 -111 212z M2399 1517 c-22 -15 -39 -38 -49 -65 -13 -37 -13 -47 0 -84 16 -45 66 -88 102 -88 35 0 88 32 103 61 8 15 15 46 15 69 0 55 -22 94 -64 114 -46 22 -67 20 -107 -7z M930 1475 l0 -55 48 0 c56 0 92 21 92 55 0 39 -25 55 -86 55 l-54 0 0 -55z M1890 1495 l0 -36 63 3 c62 3 62 3 62 33 0 30 0 30 -62 33 l-63 3 0 -36z M1890 1325 l0 -45 63 0 c49 0 68 4 80 18 41 45 13 72 -75 72 l-68 0 0 -45z";
var VIEWBOX = { mark: "144.26 112.26 213.48 200.48", stacked: "68.86 109.86 364.29 289.16", inline: "140.68 108.68 1609.93 207.64" };
var ROBO_INLINE = "translate(969.35,-2590.76) scale(3.90323)";
function Lockup({ variant = "inline", tone = "ink", color, height, title = "LK ROBOTICS", decorative = false, style, ...rest }) {
  const fill = color || (tone === "white" ? "#FFFFFF" : tone === "brand" ? "var(--lk-accent-ink)" : tone === "current" ? "currentColor" : "#0E1329");
  const vb = VIEWBOX[variant] || VIEWBOX.inline;
  const h = height != null ? height : variant === "mark" ? 32 : variant === "stacked" ? 64 : 28;
  const a11y = decorative ? { "aria-hidden": true } : { role: "img", "aria-label": title };
  return /* @__PURE__ */ jsx("svg", { viewBox: vb, height: h, ...a11y, style: { display: "block", ...style }, ...rest, children: /* @__PURE__ */ jsxs("g", { transform: "translate(0,504) scale(0.1,-0.1)", fill, children: [
    /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: LK_D }),
    variant === "stacked" && /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: ROBO_D }),
    variant === "inline" && /* @__PURE__ */ jsx("g", { transform: ROBO_INLINE, children: /* @__PURE__ */ jsx("path", { fillRule: "evenodd", d: ROBO_D }) })
  ] }) });
}

// components/buttons/Button.jsx
import React3 from "react";
import { jsx as jsx2 } from "react/jsx-runtime";
function Button({
  children,
  variant = "primary",
  size = "md",
  // sm | md | lg
  arrow = false,
  full = false,
  disabled = false,
  as = "button",
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  type,
  ...rest
}) {
  const [hover, setHover] = React3.useState(false);
  const content = React3.Children.toArray(children).map((child, index) => typeof child === "string" || typeof child === "number" ? /* @__PURE__ */ jsx2("span", { children: child }, `text-${index}`) : child);
  const heights = {
    sm: "var(--component-button-height-sm)",
    md: "var(--component-button-height-md)",
    lg: "var(--component-button-height-lg)"
  };
  const pads = {
    sm: "var(--component-button-padding-sm)",
    md: "var(--component-button-padding-md)",
    lg: "var(--component-button-padding-lg)"
  };
  const fonts = {
    sm: "var(--component-button-font-size-sm)",
    md: "var(--component-button-font-size-md)",
    lg: "var(--component-button-font-size-lg)"
  };
  const palettes = {
    primary: { bg: "var(--component-button-primary-bg)", bgHover: "var(--component-button-primary-bg-hover)", fg: "var(--component-button-primary-fg)", bd: "none", elevated: true },
    secondary: { bg: "var(--component-button-secondary-bg)", bgHover: "var(--component-button-secondary-bg-hover)", fg: "var(--component-button-secondary-fg)", bd: "none", elevated: true },
    signal: { bg: "var(--component-button-signal-bg)", bgHover: "var(--component-button-signal-bg-hover)", fg: "var(--component-button-signal-fg)", bd: "none", elevated: true },
    dark: { bg: "var(--component-button-dark-bg)", bgHover: "var(--component-button-dark-bg-hover)", fg: "var(--component-button-dark-fg)", bd: "none", elevated: true },
    flat: { bg: "var(--component-button-flat-bg)", bgHover: "var(--component-button-flat-bg-hover)", fg: "var(--component-button-flat-fg)", bd: "none", elevated: false },
    ghost: { bg: "var(--component-button-ghost-bg)", bgHover: "var(--component-button-ghost-bg-hover)", fg: "var(--component-button-ghost-fg)", bd: "var(--component-button-ghost-border)", bdHover: "var(--component-button-ghost-border-hover)", elevated: false },
    "on-dark": { bg: "var(--component-button-on-dark-bg)", bgHover: "var(--component-button-on-dark-bg-hover)", fg: "var(--component-button-on-dark-fg)", bd: "var(--component-button-on-dark-border)", elevated: false }
  };
  const p = palettes[variant] || palettes.primary;
  const active = !disabled;
  const composed = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "var(--component-button-gap)",
    height: heights[size] || heights.md,
    padding: pads[size] || pads.md,
    width: full ? "100%" : void 0,
    fontFamily: "var(--font-sans)",
    fontSize: fonts[size] || fonts.md,
    fontWeight: "var(--component-button-font-weight)",
    letterSpacing: "var(--component-button-letter-spacing)",
    color: p.fg,
    background: active && hover ? p.bgHover : p.bg,
    border: active && hover && p.bdHover ? p.bdHover : p.bd,
    borderRadius: "var(--component-button-radius)",
    boxShadow: p.elevated ? "var(--component-button-shadow-rest)" : "none",
    transform: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? "var(--component-button-disabled-opacity)" : 1,
    transition: "var(--component-button-transition)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    ...style
  };
  const Comp = as;
  return /* @__PURE__ */ jsx2(
    Comp,
    {
      className: `lk-btn lk-btn--${variant}`,
      style: composed,
      disabled: as === "button" ? disabled : void 0,
      type: as === "button" ? type ?? "button" : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        onMouseUp && onMouseUp(e);
      },
      ...rest,
      children: content
    }
  );
}

// components/buttons/ButtonGroup.jsx
import React4 from "react";
import { jsx as jsx3 } from "react/jsx-runtime";
function ButtonGroup({ options = [], value, defaultValue, onChange, size = "md", multiple = false, style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React4.useState(defaultValue != null ? defaultValue : multiple ? [] : norm[0] && norm[0].value);
  const val = isControlled ? value : internal;
  const isActive = (v) => multiple ? Array.isArray(val) && val.includes(v) : val === v;
  const pick = (v) => {
    let next;
    if (multiple) {
      const arr = Array.isArray(val) ? val : [];
      next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    } else next = v;
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const h = size === "sm" ? 36 : 44;
  const fs = size === "sm" ? 14 : 15;
  return /* @__PURE__ */ jsx3("div", { role: "group", style: { display: "inline-flex", ...style }, ...rest, children: norm.map((o, i) => {
    const active = isActive(o.value);
    const first = i === 0;
    const last = i === norm.length - 1;
    return /* @__PURE__ */ jsx3(
      "button",
      {
        type: "button",
        "aria-pressed": active,
        onClick: () => pick(o.value),
        style: {
          height: h,
          padding: "0 16px",
          cursor: "pointer",
          fontFamily: "var(--font-sans)",
          fontSize: fs,
          fontWeight: active ? "var(--fw-bold)" : "var(--fw-semibold)",
          letterSpacing: 0,
          color: active ? "var(--lk-accent-ink)" : "var(--label-neutral)",
          background: active ? "var(--lk-accent-tint-2)" : "var(--bw-white)",
          border: `1px solid ${active ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
          marginLeft: first ? 0 : -1,
          zIndex: active ? 1 : 0,
          borderTopLeftRadius: first ? "var(--radius-md)" : 0,
          borderBottomLeftRadius: first ? "var(--radius-md)" : 0,
          borderTopRightRadius: last ? "var(--radius-md)" : 0,
          borderBottomRightRadius: last ? "var(--radius-md)" : 0,
          transition: "var(--component-button-transition)",
          whiteSpace: "nowrap"
        },
        children: o.label
      },
      o.value
    );
  }) });
}

// components/buttons/CopyButton.jsx
import React5 from "react";
import { jsx as jsx4, jsxs as jsxs2 } from "react/jsx-runtime";
function CopyButton({ value, children = "\uBCF5\uC0AC", copiedLabel = "\uBCF5\uC0AC\uB428", size = "md", style, ...rest }) {
  const [copied, setCopied] = React5.useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(String(value));
    } catch (e) {
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  const h = size === "sm" ? 36 : 44;
  return /* @__PURE__ */ jsxs2(
    "button",
    {
      type: "button",
      onClick: copy,
      style: { display: "inline-flex", alignItems: "center", gap: 7, height: h, padding: "0 14px", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", background: copied ? "var(--lk-accent-tint-2)" : "var(--bw-indigo-tint)", color: copied ? "var(--lk-accent-ink)" : "var(--label-normal)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: "var(--fw-bold)", letterSpacing: 0, transition: "var(--component-button-transition)", ...style },
      ...rest,
      children: [
        copied ? /* @__PURE__ */ jsx4("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx4("path", { d: "M20 6 9 17l-5-5" }) }) : /* @__PURE__ */ jsxs2("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx4("rect", { x: "9", y: "9", width: "11", height: "11", rx: "2.5" }),
          /* @__PURE__ */ jsx4("path", { d: "M5 15V5a2 2 0 0 1 2-2h10" })
        ] }),
        /* @__PURE__ */ jsx4("span", { children: copied ? copiedLabel : children })
      ]
    }
  );
}

// components/buttons/Fab.jsx
import React6 from "react";
import { jsx as jsx5 } from "react/jsx-runtime";
function Fab({ children, variant = "signal", size = "md", label, style, ...rest }) {
  const d = size === "sm" ? 48 : size === "lg" ? 64 : 56;
  const palettes = {
    signal: { bg: "var(--lk-accent-ink)", fg: "var(--text-on-signal)", sh: "var(--shadow-accent)" },
    dark: { bg: "var(--surface-inverse)", fg: "var(--text-on-inverse)", sh: "var(--shadow-md)" },
    primary: { bg: "var(--color-primary)", fg: "#fff", sh: "var(--shadow-accent)" },
    secondary: { bg: "var(--bw-indigo)", fg: "#fff", sh: "var(--shadow-indigo)" },
    white: { bg: "var(--bw-white)", fg: "var(--label-normal)", sh: "var(--shadow-md)" }
  };
  const p = palettes[variant] || palettes.signal;
  return /* @__PURE__ */ jsx5(
    "button",
    {
      type: "button",
      "aria-label": label,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: d,
        height: d,
        borderRadius: "50%",
        border: variant === "white" ? "1px solid var(--bw-border)" : "none",
        background: p.bg,
        color: p.fg,
        cursor: "pointer",
        boxShadow: p.sh || "var(--shadow-md)",
        transform: "none",
        transition: "var(--component-button-transition)",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/buttons/IconButton.jsx
import React7 from "react";
import { jsx as jsx6 } from "react/jsx-runtime";
function IconButton({
  children,
  variant = "soft",
  size = 44,
  round = false,
  label,
  style,
  disabled = false,
  onMouseEnter,
  onMouseLeave,
  type,
  ...rest
}) {
  const [hover, setHover] = React7.useState(false);
  const palettes = {
    soft: { bg: "var(--bw-indigo-tint)", bgHover: "var(--bw-indigo-tint)", fg: "var(--bw-ink)", bd: "none" },
    solid: { bg: "var(--bw-indigo)", bgHover: "var(--bw-indigo)", fg: "#fff", bd: "none" },
    signal: { bg: "var(--lk-accent-ink)", bgHover: "var(--lk-accent-ink)", fg: "var(--text-on-signal)", bd: "none" },
    ghost: { bg: "var(--bw-white)", bgHover: "var(--bw-white)", fg: "var(--bw-ink)", bd: "1px solid var(--bw-border)" },
    "on-dark": { bg: "rgba(255,255,255,0.12)", bgHover: "rgba(255,255,255,0.14)", fg: "#fff", bd: "1px solid rgba(255,255,255,0.22)" }
  };
  const p = palettes[variant] || palettes.soft;
  return /* @__PURE__ */ jsx6(
    "button",
    {
      type: type ?? "button",
      "aria-label": label,
      className: `lk-iconbtn lk-iconbtn--${variant}`,
      disabled,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: size,
        height: size,
        color: p.fg,
        background: hover && !disabled ? p.bgHover : p.bg,
        border: p.bd,
        borderRadius: round ? "var(--radius-pill)" : "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.45 : 1,
        boxShadow: "none",
        transition: "var(--component-button-transition)",
        WebkitTapHighlightColor: "transparent",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/buttons/Link.jsx
import React8 from "react";
import { jsx as jsx7, jsxs as jsxs3 } from "react/jsx-runtime";
function Link({ children, href, tone = "signal", underline = "hover", external = false, style, onMouseEnter, onMouseLeave, ...rest }) {
  const [hover, setHover] = React8.useState(false);
  const color = tone === "neutral" ? "var(--label-neutral)" : tone === "inherit" ? "inherit" : "var(--lk-accent-ink)";
  const showUnderline = underline === "always" || underline === "hover" && hover;
  return /* @__PURE__ */ jsxs3(
    "a",
    {
      href,
      target: external ? "_blank" : void 0,
      rel: external ? "noopener noreferrer" : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        color,
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        textDecoration: showUnderline ? "underline" : "none",
        textUnderlineOffset: "2px",
        cursor: "pointer",
        ...style
      },
      ...rest,
      children: [
        children,
        external && /* @__PURE__ */ jsx7("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx7("path", { d: "M7 17 17 7M8 7h9v9" }) })
      ]
    }
  );
}

// components/buttons/SocialButton.jsx
import React9 from "react";
import { jsx as jsx8, jsxs as jsxs4 } from "react/jsx-runtime";
function SocialButton({
  provider = "google",
  // google | apple | facebook
  align = "center",
  // center | left  (킷의 Centre / Left Aligned)
  tone = "outline",
  // outline | brand
  iconOnly = false,
  // 원형 아이콘 버튼(48px 서클) — 레퍼런스 킷의 소셜 아이콘 행
  full = false,
  disabled = false,
  as = "button",
  children,
  style,
  onMouseEnter,
  onMouseLeave,
  onMouseDown,
  onMouseUp,
  type,
  ...rest
}) {
  const [hover, setHover] = React9.useState(false);
  const KIT_SHADOW = "0px 0px 3px 0px rgba(0,0,0,0.084), 0px 2px 3px 0px rgba(0,0,0,0.168)";
  const brandFills = {
    google: { bg: "rgb(255,255,255)", bgHover: "rgb(255,255,255)", fg: "rgba(0,0,0,0.54)", bd: "none", shadow: KIT_SHADOW, mono: false },
    apple: { bg: "rgb(0,0,0)", bgHover: "rgb(0,0,0)", fg: "#FFFFFF", bd: "none", shadow: KIT_SHADOW, mono: false },
    facebook: { bg: "rgb(24,119,242)", bgHover: "rgb(24,119,242)", fg: "#FFFFFF", bd: "none", shadow: "none", mono: true }
  };
  const outline = {
    bg: "var(--surface-raised, #FFFFFF)",
    bgHover: "var(--surface-raised, #FFFFFF)",
    fg: "var(--label-normal)",
    bd: "1px solid var(--bw-border)",
    bdHover: "1px solid var(--bw-border)",
    shadow: "none",
    mono: false
  };
  const labels = { google: "Google\uB85C \uACC4\uC18D\uD558\uAE30", apple: "Apple\uB85C \uACC4\uC18D\uD558\uAE30", facebook: "Facebook\uC73C\uB85C \uACC4\uC18D\uD558\uAE30" };
  const p = tone === "brand" ? brandFills[provider] || brandFills.google : outline;
  const active = !disabled;
  const composed = {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: iconOnly ? "center" : align === "left" ? "flex-start" : "center",
    gap: iconOnly ? 0 : "9px",
    height: iconOnly ? "48px" : "52px",
    padding: iconOnly ? "0" : "0 20px",
    width: iconOnly ? "48px" : full ? "100%" : void 0,
    flexShrink: iconOnly ? 0 : void 0,
    boxSizing: "border-box",
    fontFamily: "var(--font-sans)",
    fontSize: "16px",
    fontWeight: "var(--fw-bold)",
    letterSpacing: 0,
    lineHeight: 1,
    color: p.fg,
    background: active && hover ? p.bgHover : p.bg,
    border: active && hover && p.bdHover ? p.bdHover : p.bd,
    borderRadius: iconOnly ? "999px" : "var(--radius-md)",
    boxShadow: p.shadow,
    transform: "none",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    transition: "var(--component-button-transition)",
    whiteSpace: "nowrap",
    textDecoration: "none",
    WebkitTapHighlightColor: "transparent",
    ...style
  };
  const Comp = as;
  const label = typeof children === "string" ? children : labels[provider];
  return /* @__PURE__ */ jsxs4(
    Comp,
    {
      className: `lk-social-btn lk-social-btn--${provider}`,
      style: composed,
      disabled: as === "button" ? disabled : void 0,
      type: as === "button" ? type ?? "button" : void 0,
      "aria-label": iconOnly ? label : void 0,
      title: iconOnly ? label : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      onMouseDown: (e) => {
        onMouseDown && onMouseDown(e);
      },
      onMouseUp: (e) => {
        onMouseUp && onMouseUp(e);
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx8(BrandLogo, { name: provider, size: iconOnly ? 22 : 20, mono: p.mono, decorative: true, style: { flexShrink: 0 } }),
        !iconOnly && /* @__PURE__ */ jsx8("span", { children: children ?? labels[provider] })
      ]
    }
  );
}

// components/buttons/SplitButton.jsx
import React10 from "react";
import { jsx as jsx9, jsxs as jsxs5 } from "react/jsx-runtime";
function SplitButton({ children, onClick, items = [], variant = "primary", size = "md", style, ...rest }) {
  const [open, setOpen] = React10.useState(false);
  const ref = React10.useRef(null);
  React10.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const pal = variant === "signal" ? { bg: "var(--lk-accent-ink)", fg: "var(--text-on-signal)" } : variant === "dark" ? { bg: "var(--surface-inverse)", fg: "var(--text-on-inverse)" } : variant === "secondary" ? { bg: "var(--bw-indigo)", fg: "#fff" } : { bg: "var(--color-primary)", fg: "#fff" };
  const h = size === "sm" ? 44 : 52;
  return /* @__PURE__ */ jsxs5("div", { ref, style: { position: "relative", display: "inline-flex", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx9("button", { type: "button", onClick, style: { height: h, padding: "0 20px", border: "none", borderTopLeftRadius: "var(--radius-md)", borderBottomLeftRadius: "var(--radius-md)", background: pal.bg, color: pal.fg, cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 16, fontWeight: "var(--fw-bold)", letterSpacing: 0 }, children }),
    /* @__PURE__ */ jsx9("button", { type: "button", "aria-label": "more actions", onClick: () => setOpen((o) => !o), style: { height: h, width: 42, border: "none", borderLeft: "1px solid rgba(255,255,255,0.22)", borderTopRightRadius: "var(--radius-md)", borderBottomRightRadius: "var(--radius-md)", background: pal.bg, color: pal.fg, cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx9("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx9("path", { d: "m6 9 6 6 6-6" }) }) }),
    open && /* @__PURE__ */ jsx9("div", { role: "menu", style: { position: "absolute", top: "calc(100% + 8px)", right: 0, zIndex: 40, minWidth: 184, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 6 }, children: items.map((it, i) => /* @__PURE__ */ jsxs5("button", { type: "button", role: "menuitem", onClick: () => {
      setOpen(false);
      it.onClick && it.onClick();
    }, onMouseEnter: (e) => {
      e.currentTarget.style.background = "var(--fill-normal)";
    }, onMouseLeave: (e) => {
      e.currentTarget.style.background = "transparent";
    }, style: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", background: "transparent", cursor: "pointer", borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: "var(--fw-medium)", color: "var(--label-normal)" }, children: [
      it.icon,
      /* @__PURE__ */ jsx9("span", { children: it.label })
    ] }, i)) })
  ] });
}

// components/buttons/TextButton.jsx
import React11 from "react";
import { jsx as jsx10 } from "react/jsx-runtime";
function TextButton({
  children,
  tone = "signal",
  size = "md",
  arrow = false,
  underline = false,
  disabled = false,
  as = "button",
  style,
  onMouseEnter,
  onMouseLeave,
  type,
  ...rest
}) {
  const [hover, setHover] = React11.useState(false);
  const color = tone === "neutral" ? "var(--label-neutral)" : tone === "danger" ? "var(--bw-red)" : "var(--lk-accent-ink)";
  const fs = size === "sm" ? 14 : size === "lg" ? 17 : 16;
  const Comp = as;
  return /* @__PURE__ */ jsx10(
    Comp,
    {
      className: "lk-textbtn",
      disabled: as === "button" ? disabled : void 0,
      type: as === "button" ? type ?? "button" : void 0,
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        padding: 0,
        border: "none",
        background: "transparent",
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        color,
        opacity: disabled ? 0.45 : hover ? "var(--component-button-text-hover-opacity)" : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        textDecoration: underline ? "underline" : "none",
        textUnderlineOffset: "3px",
        transition: "var(--component-button-transition)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsx10("span", { children })
    }
  );
}

// components/cards/Card.jsx
import React12 from "react";
import { jsx as jsx11 } from "react/jsx-runtime";
function Card({
  children,
  elevation = "md",
  interactive = false,
  dark = false,
  padding,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const shadows = {
    none: "var(--component-card-shadow-none)",
    sm: "var(--component-card-shadow-sm)",
    md: "var(--component-card-shadow-md)",
    lg: "var(--component-card-shadow-lg)"
  };
  const [hover, setHover] = React12.useState(false);
  return /* @__PURE__ */ jsx11(
    "div",
    {
      onMouseEnter: (e) => {
        if (interactive) setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        if (interactive) setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        background: dark ? "var(--component-card-bg-dark)" : "var(--component-card-bg)",
        color: dark ? "var(--component-card-fg-dark)" : "var(--component-card-fg)",
        border: dark ? "var(--component-card-border-dark)" : "var(--component-card-border)",
        borderRadius: "var(--component-card-radius)",
        boxShadow: interactive && hover ? "var(--component-card-shadow-lg)" : shadows[elevation],
        transform: interactive && hover ? "var(--component-card-hover-transform)" : "none",
        transition: "var(--component-card-transition)",
        padding: padding != null ? padding : "var(--component-card-padding)",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/cards/ChecklistItem.jsx
import React13 from "react";
import { jsx as jsx12, jsxs as jsxs6 } from "react/jsx-runtime";
function ChecklistItem({
  children,
  cross = false,
  muted = false,
  dark = false,
  style,
  ...rest
}) {
  const ok = !cross;
  const color = ok ? dark ? "var(--lk-accent)" : "var(--lk-accent-ink)" : "var(--bw-red)";
  return /* @__PURE__ */ jsxs6("div", { style: { display: "flex", alignItems: "flex-start", gap: "11px", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx12("span", { style: { display: "inline-flex", flexShrink: 0, marginTop: 2, color }, children: ok ? /* @__PURE__ */ jsx12("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx12("path", { d: "M20 6 9 17l-5-5" }) }) : /* @__PURE__ */ jsxs6("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx12("path", { d: "M18 6 6 18" }),
      /* @__PURE__ */ jsx12("path", { d: "m6 6 12 12" })
    ] }) }),
    /* @__PURE__ */ jsx12("span", { style: {
      fontSize: "16.5px",
      fontWeight: "var(--fw-semibold)",
      lineHeight: 1.5,
      letterSpacing: 0,
      color: dark ? "var(--text-on-dark)" : muted ? "var(--bw-gray)" : "var(--bw-gray-700)",
      opacity: dark && muted ? 0.7 : 1,
      textDecoration: cross ? "line-through" : "none",
      wordBreak: "keep-all"
    }, children })
  ] });
}

// components/cards/FeatureCard.jsx
import React14 from "react";
import { jsx as jsx13, jsxs as jsxs7 } from "react/jsx-runtime";
var ICON_TONES = {
  signal: { fg: "var(--lk-accent-ink)", bg: "var(--lk-accent-tint)" },
  // teal tile (default)
  steel: { fg: "var(--bw-green-600)", bg: "rgba(94,110,134,0.14)" },
  amber: { fg: "#9A7424", bg: "rgba(194,154,82,0.18)" },
  navy: { fg: "var(--bw-ink)", bg: "var(--fill-strong)" }
};
function FeatureCard({
  icon,
  title,
  children,
  tone = "signal",
  boxed = false,
  style,
  ...rest
}) {
  const t = ICON_TONES[tone] || ICON_TONES.signal;
  return /* @__PURE__ */ jsxs7(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        background: boxed ? "var(--surface-card)" : "transparent",
        border: boxed ? "1px solid var(--bw-border)" : "none",
        borderRadius: boxed ? "var(--radius-xl)" : 0,
        boxShadow: boxed ? "var(--shadow-md)" : "none",
        padding: boxed ? "var(--space-8)" : 0,
        ...style
      },
      ...rest,
      children: [
        icon && /* @__PURE__ */ jsx13("span", { style: { display: "inline-flex", alignItems: "center", justifyContent: "center", width: 52, height: 52, borderRadius: 14, color: t.fg, background: t.bg }, children: icon }),
        /* @__PURE__ */ jsxs7("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
          /* @__PURE__ */ jsx13("h4", { style: { fontSize: "19px", fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--bw-ink)", margin: 0, wordBreak: "keep-all" }, children: title }),
          /* @__PURE__ */ jsx13("p", { style: { fontSize: "15.5px", lineHeight: 1.7, color: "var(--bw-gray)", margin: 0, wordBreak: "keep-all" }, children })
        ] })
      ]
    }
  );
}

// components/cards/MetricCard.jsx
import React15 from "react";
import { jsx as jsx14, jsxs as jsxs8 } from "react/jsx-runtime";
function MetricCard({ label, value, delta, deltaTone = "auto", caption, icon, style, ...rest }) {
  const tone = deltaTone === "auto" ? typeof delta === "number" ? delta >= 0 ? "up" : "down" : "flat" : deltaTone;
  const up = tone === "up";
  const dc = up ? "var(--bw-green)" : tone === "down" ? "var(--bw-red)" : "var(--label-alternative)";
  const deltaText = typeof delta === "number" ? `${delta > 0 ? "+" : ""}${delta}%` : delta;
  return /* @__PURE__ */ jsxs8("div", { style: { background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-xl)", padding: "22px 24px", boxShadow: "var(--shadow-xs)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs8("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 14 }, children: [
      /* @__PURE__ */ jsx14("span", { style: { fontSize: 12, fontWeight: "var(--fw-bold)", letterSpacing: "1.4px", textTransform: "uppercase", color: "var(--label-alternative)" }, children: label }),
      icon && /* @__PURE__ */ jsx14("span", { style: { color: "var(--lk-accent-ink)", display: "inline-flex" }, children: icon })
    ] }),
    /* @__PURE__ */ jsxs8("div", { style: { display: "flex", alignItems: "flex-end", gap: 10, flexWrap: "wrap" }, children: [
      /* @__PURE__ */ jsx14("span", { style: { fontSize: 34, fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--label-normal)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }, children: value }),
      delta != null && /* @__PURE__ */ jsxs8("span", { style: { display: "inline-flex", alignItems: "center", gap: 3, fontSize: 13, fontWeight: "var(--fw-bold)", color: dc }, children: [
        (tone === "up" || tone === "down") && /* @__PURE__ */ jsx14("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx14("path", { d: up ? "M7 17 17 7M9 7h8v8" : "M7 7l10 10M17 9v8H9" }) }),
        deltaText
      ] })
    ] }),
    caption != null && /* @__PURE__ */ jsx14("div", { style: { marginTop: 8, fontSize: 13, color: "var(--label-alternative)" }, children: caption })
  ] });
}

// components/cards/NewsCard.jsx
import React16 from "react";
import { jsx as jsx15, jsxs as jsxs9 } from "react/jsx-runtime";
function NewsCard({ image, category, title, excerpt, source, date, cta, href = "#", style, ...rest }) {
  const [hover, setHover] = React16.useState(false);
  const ArrowR = /* @__PURE__ */ jsxs9("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.3", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx15("path", { d: "M5 12h14" }),
    /* @__PURE__ */ jsx15("path", { d: "m12 5 7 7-7 7" })
  ] });
  return /* @__PURE__ */ jsxs9(
    "a",
    {
      href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "flex",
        flexDirection: "column",
        background: "var(--surface-card)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        overflow: "hidden",
        textDecoration: "none",
        boxShadow: hover ? "var(--shadow-md)" : "var(--shadow-xs)",
        transform: hover ? "translateY(-2px)" : "none",
        transition: "transform var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        image && /* @__PURE__ */ jsx15("div", { style: { aspectRatio: "16 / 9", overflow: "hidden", background: "var(--surface-subtle)" }, children: /* @__PURE__ */ jsx15("img", { src: image, alt: "", style: { width: "100%", height: "100%", objectFit: "cover", transform: hover ? "scale(1.03)" : "scale(1)", transition: "transform 520ms var(--ease-out)" } }) }),
        /* @__PURE__ */ jsxs9("div", { style: { padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 9, flex: 1 }, children: [
          category && /* @__PURE__ */ jsx15("span", { style: { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-overline)", textTransform: "uppercase", color: "var(--label-alternative)" }, children: category }),
          title && /* @__PURE__ */ jsx15("h3", { style: { margin: 0, fontSize: 18, fontWeight: "var(--fw-extra)", letterSpacing: 0, lineHeight: 1.36, color: "var(--text-strong)", wordBreak: "keep-all" }, children: title }),
          excerpt && /* @__PURE__ */ jsx15("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.62, color: "var(--label-neutral)", wordBreak: "keep-all" }, children: excerpt }),
          (source || date || cta) && /* @__PURE__ */ jsxs9("div", { style: { marginTop: "auto", paddingTop: 12, display: "flex", alignItems: "center", gap: 8, fontSize: 12.5, color: "var(--label-alternative)" }, children: [
            source && /* @__PURE__ */ jsx15("span", { style: { fontWeight: 600 }, children: source }),
            source && date && /* @__PURE__ */ jsx15("span", { "aria-hidden": "true", children: "\xB7" }),
            date && /* @__PURE__ */ jsx15("span", { style: { fontVariantNumeric: "tabular-nums" }, children: date }),
            cta && /* @__PURE__ */ jsxs9("span", { style: { marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, fontWeight: 700, color: "var(--accent-text)", whiteSpace: "nowrap" }, children: [
              cta,
              /* @__PURE__ */ jsx15("span", { style: { display: "inline-flex", transform: hover ? "translateX(2px)" : "none", transition: "transform var(--dur-base) var(--ease-out)" }, children: ArrowR })
            ] })
          ] })
        ] })
      ]
    }
  );
}

// components/cards/ProductCard.jsx
import React17 from "react";
import { jsx as jsx16, jsxs as jsxs10 } from "react/jsx-runtime";
var PC_FADE = "linear-gradient(180deg, #000 46%, transparent 96%)";
function ProductCard({
  id,
  category,
  description,
  image,
  imagePosition = "50% 30%",
  href = "#",
  cta,
  style,
  ...rest
}) {
  const [hover, setHover] = React17.useState(false);
  return /* @__PURE__ */ jsxs10(
    "a",
    {
      href,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        aspectRatio: "4 / 5",
        background: "linear-gradient(180deg, var(--lk-stage-from) 0%, var(--lk-stage-to) 100%)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-2xl)",
        overflow: "hidden",
        boxShadow: hover ? "var(--shadow-xl)" : "var(--shadow-sm)",
        transition: "box-shadow var(--dur-base) var(--ease-out)",
        textDecoration: "none",
        ...style
      },
      ...rest,
      children: [
        image && /* @__PURE__ */ jsxs10(
          "div",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: "68%",
              pointerEvents: "none",
              WebkitMaskImage: PC_FADE,
              maskImage: PC_FADE
            },
            children: [
              /* @__PURE__ */ jsx16(
                "img",
                {
                  src: image,
                  alt: "",
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: imagePosition,
                    display: "block",
                    transform: hover ? "scale(1.05)" : "scale(1)",
                    transition: "transform 600ms var(--ease-out)"
                  }
                }
              ),
              /* @__PURE__ */ jsx16("div", { style: { position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 34%, rgba(14,19,41,0.5) 88%)" } })
            ]
          }
        ),
        /* @__PURE__ */ jsxs10("div", { style: { position: "relative", padding: "18px 20px 20px", display: "flex", flexDirection: "column", gap: 9 }, children: [
          /* @__PURE__ */ jsxs10("div", { style: { display: "flex", flexDirection: "column", gap: 3 }, children: [
            category && /* @__PURE__ */ jsx16("span", { style: { fontSize: "var(--fs-caption)", fontWeight: "var(--fw-bold)", letterSpacing: "var(--ls-overline)", textTransform: "uppercase", color: "var(--lk-accent)" }, children: category }),
            /* @__PURE__ */ jsx16("h3", { style: { margin: 0, fontSize: "var(--fs-h5)", lineHeight: "var(--lh-h5)", fontWeight: 800, letterSpacing: "var(--ls-h5)", color: "#fff", whiteSpace: "nowrap" }, children: id })
          ] }),
          description && /* @__PURE__ */ jsx16("p", { style: { margin: 0, fontSize: 14, lineHeight: 1.62, color: "rgba(255,255,255,0.72)", wordBreak: "keep-all" }, children: description }),
          cta && /* @__PURE__ */ jsx16("span", { style: {
            alignSelf: "flex-end",
            marginTop: 4,
            whiteSpace: "nowrap",
            fontSize: 12.5,
            fontWeight: "var(--fw-bold)",
            letterSpacing: 0,
            color: hover ? "#fff" : "rgba(255,255,255,0.66)",
            textDecoration: hover ? "underline" : "none",
            textUnderlineOffset: 3,
            transition: "color var(--dur-fast) var(--ease-out)"
          }, children: cta })
        ] })
      ]
    }
  );
}

// components/cards/SpecRow.jsx
import React18 from "react";
import { jsx as jsx17, jsxs as jsxs11 } from "react/jsx-runtime";
function SpecRow({ label, value, labelWidth = "34%", style, ...rest }) {
  return /* @__PURE__ */ jsxs11(
    "div",
    {
      style: {
        display: "grid",
        gridTemplateColumns: `${labelWidth} 1fr`,
        gap: 16,
        padding: "14px 0",
        borderBottom: "1px solid var(--border-subtle)",
        alignItems: "baseline",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx17("div", { style: { fontSize: 14, fontWeight: "var(--fw-semibold)", letterSpacing: "var(--ls-small)", color: "var(--label-alternative)", wordBreak: "keep-all" }, children: label }),
        /* @__PURE__ */ jsx17("div", { style: { fontSize: "var(--fs-small)", fontWeight: "var(--fw-semibold)", lineHeight: "var(--lh-small)", letterSpacing: "var(--ls-small)", color: "var(--label-normal)", fontVariantNumeric: "tabular-nums", wordBreak: "keep-all" }, children: value })
      ]
    }
  );
}

// components/cards/Stat.jsx
import React19 from "react";
import { jsx as jsx18, jsxs as jsxs12 } from "react/jsx-runtime";
function Stat({
  value,
  label,
  accent = "ink",
  dark = false,
  stacked = false,
  style,
  ...rest
}) {
  const colors = { ink: "var(--bw-ink)", signal: "var(--lk-accent-ink)", steel: "var(--bw-green-600)" };
  const valColor = dark ? "var(--text-on-dark)" : colors[accent] || colors.ink;
  const labColor = dark ? "var(--text-on-dark-muted)" : "var(--bw-gray)";
  return /* @__PURE__ */ jsxs12(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: stacked ? "column" : "row",
        alignItems: stacked ? "flex-start" : "baseline",
        gap: stacked ? "6px" : "14px",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx18("span", { style: { fontSize: "40px", fontWeight: "var(--fw-extra)", letterSpacing: 0, lineHeight: 1, color: valColor, fontVariantNumeric: "tabular-nums" }, children: value }),
        /* @__PURE__ */ jsx18("span", { style: { fontSize: "15px", lineHeight: 1.5, maxWidth: stacked ? "none" : 160, color: labColor, wordBreak: "keep-all" }, children: label })
      ]
    }
  );
}

// components/content/Accordion.jsx
import React20 from "react";
import { jsx as jsx19, jsxs as jsxs13 } from "react/jsx-runtime";
function Accordion({ items = [], multiple = false, defaultOpen = [], style, ...rest }) {
  const [open, setOpen] = React20.useState(() => new Set(defaultOpen));
  const toggle = (i) => setOpen((prev) => {
    const next = new Set(multiple ? prev : []);
    if (prev.has(i)) next.delete(i);
    else next.add(i);
    return next;
  });
  return /* @__PURE__ */ jsx19("div", { style: { borderTop: "1px solid var(--bw-border)", ...style }, ...rest, children: items.map((it, i) => {
    const isOpen = open.has(i);
    return /* @__PURE__ */ jsxs13("div", { style: { borderBottom: "1px solid var(--bw-border)" }, children: [
      /* @__PURE__ */ jsxs13(
        "button",
        {
          type: "button",
          "aria-expanded": isOpen,
          onClick: () => toggle(i),
          style: {
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            padding: "18px 4px",
            border: "none",
            background: "transparent",
            cursor: "pointer",
            textAlign: "left",
            fontFamily: "var(--font-sans)",
            fontSize: 17,
            fontWeight: "var(--fw-bold)",
            letterSpacing: 0,
            color: isOpen ? "var(--lk-accent-ink)" : "var(--label-normal)",
            transition: "color var(--dur-fast) var(--ease-out)"
          },
          children: [
            /* @__PURE__ */ jsx19("span", { style: { wordBreak: "keep-all" }, children: it.title }),
            /* @__PURE__ */ jsx19(
              "svg",
              {
                width: "20",
                height: "20",
                viewBox: "0 0 24 24",
                fill: "none",
                stroke: "currentColor",
                strokeWidth: "2.2",
                strokeLinecap: "round",
                strokeLinejoin: "round",
                "aria-hidden": "true",
                style: { flexShrink: 0, transform: isOpen ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)" },
                children: /* @__PURE__ */ jsx19("path", { d: "m6 9 6 6 6-6" })
              }
            )
          ]
        }
      ),
      /* @__PURE__ */ jsx19("div", { style: { display: "grid", gridTemplateRows: isOpen ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ jsx19("div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ jsx19("div", { style: { padding: "0 4px 20px", fontFamily: "var(--font-sans)", fontSize: 15, lineHeight: 1.7, color: "var(--label-neutral)", wordBreak: "keep-all" }, children: it.content }) }) })
    ] }, i);
  }) });
}

// components/content/Blockquote.jsx
import React21 from "react";
import { jsx as jsx20, jsxs as jsxs14 } from "react/jsx-runtime";
function Blockquote({ children, cite, style, ...rest }) {
  return /* @__PURE__ */ jsxs14("blockquote", { style: { margin: 0, padding: "6px 0 6px 20px", borderLeft: "3px solid var(--lk-accent-ink)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx20("div", { style: { fontSize: 17, lineHeight: 1.7, letterSpacing: 0, color: "var(--label-normal)", wordBreak: "keep-all" }, children }),
    cite != null && /* @__PURE__ */ jsxs14("div", { style: { marginTop: 8, fontSize: 13.5, fontWeight: "var(--fw-semibold)", color: "var(--label-alternative)" }, children: [
      "\u2014 ",
      cite
    ] })
  ] });
}

// components/content/Bookmark.jsx
import React22 from "react";
import { jsx as jsx21 } from "react/jsx-runtime";
function Bookmark({ active, defaultActive, onChange, size = 24, disabled = false, style, ...rest }) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = React22.useState(!!defaultActive);
  const on = isControlled ? active : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ jsx21(
    "button",
    {
      type: "button",
      "aria-pressed": on,
      "aria-label": "bookmark",
      disabled,
      onClick: toggle,
      onMouseDown: (e) => {
        e.currentTarget.style.transform = "scale(0.86)";
      },
      onMouseUp: (e) => {
        e.currentTarget.style.transform = "none";
      },
      onMouseLeave: (e) => {
        e.currentTarget.style.transform = "none";
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 4,
        border: "none",
        background: "transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        color: on ? "var(--lk-accent-ink)" : "var(--label-assistive)",
        transition: "color var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: /* @__PURE__ */ jsx21("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: on ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx21("path", { d: "M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" }) })
    }
  );
}

// components/content/Bubble.jsx
import React23 from "react";
import { jsx as jsx22, jsxs as jsxs15 } from "react/jsx-runtime";
function Bubble({ children, tone = "navy", tail = "bottom", style, ...rest }) {
  const dark = tone === "navy";
  const bg = dark ? "var(--surface-inverse)" : "var(--surface-card)";
  const fg = dark ? "#fff" : "var(--label-normal)";
  const bd = dark ? "none" : "1px solid var(--bw-border)";
  const tailBase = { position: "absolute", width: 12, height: 12, background: bg, transform: "rotate(45deg)" };
  const tails = {
    bottom: { ...tailBase, bottom: -6, left: "50%", marginLeft: -6, borderRight: bd, borderBottom: bd },
    top: { ...tailBase, top: -6, left: "50%", marginLeft: -6, borderLeft: bd, borderTop: bd },
    left: { ...tailBase, left: -6, top: "50%", marginTop: -6, borderLeft: bd, borderBottom: bd },
    right: { ...tailBase, right: -6, top: "50%", marginTop: -6, borderRight: bd, borderTop: bd }
  };
  return /* @__PURE__ */ jsxs15(
    "div",
    {
      style: {
        position: "relative",
        display: "inline-block",
        maxWidth: 280,
        padding: "12px 15px",
        background: bg,
        color: fg,
        border: bd,
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-md)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        lineHeight: 1.6,
        letterSpacing: 0,
        wordBreak: "keep-all",
        ...style
      },
      ...rest,
      children: [
        children,
        /* @__PURE__ */ jsx22("span", { style: tails[tail] || tails.bottom })
      ]
    }
  );
}

// components/content/Code.jsx
import React24 from "react";
import { jsx as jsx23 } from "react/jsx-runtime";
var MONO2 = 'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace';
function Code({ children, block = false, style, ...rest }) {
  if (block) {
    return /* @__PURE__ */ jsx23("pre", { style: { margin: 0, padding: "14px 16px", background: "var(--surface-inverse)", color: "#E6E9F2", borderRadius: "var(--radius-lg)", overflowX: "auto", fontFamily: MONO2, fontSize: 13, lineHeight: 1.6, ...style }, ...rest, children: /* @__PURE__ */ jsx23("code", { children }) });
  }
  return /* @__PURE__ */ jsx23("code", { style: { padding: "2px 6px", background: "var(--fill-strong)", color: "var(--label-normal)", borderRadius: "var(--radius-sm)", fontFamily: MONO2, fontSize: "0.9em", ...style }, ...rest, children });
}

// components/content/Collapsible.jsx
import React25 from "react";
import { jsx as jsx24, jsxs as jsxs16 } from "react/jsx-runtime";
function Collapsible({ title, children, defaultOpen = false, style, ...rest }) {
  const [open, setOpen] = React25.useState(defaultOpen);
  return /* @__PURE__ */ jsxs16("div", { style: { ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs16(
      "button",
      {
        type: "button",
        "aria-expanded": open,
        onClick: () => setOpen((o) => !o),
        style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "12px 4px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 15.5, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)" },
        children: [
          /* @__PURE__ */ jsx24("span", { children: title }),
          /* @__PURE__ */ jsx24("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-alternative)", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-base) var(--ease-out)", flexShrink: 0 }, children: /* @__PURE__ */ jsx24("path", { d: "m6 9 6 6 6-6" }) })
        ]
      }
    ),
    /* @__PURE__ */ jsx24("div", { style: { display: "grid", gridTemplateRows: open ? "1fr" : "0fr", transition: "grid-template-rows var(--dur-base) var(--ease-out)" }, children: /* @__PURE__ */ jsx24("div", { style: { overflow: "hidden" }, children: /* @__PURE__ */ jsx24("div", { style: { padding: "0 4px 14px", fontFamily: "var(--font-sans)", fontSize: 14.5, lineHeight: 1.7, color: "var(--label-neutral)", wordBreak: "keep-all" }, children }) }) })
  ] });
}

// components/content/ContentBadge.jsx
import React26 from "react";
import { jsx as jsx25 } from "react/jsx-runtime";
var TONES = {
  signal: "var(--lk-accent-ink)",
  navy: "var(--surface-inverse)",
  neutral: "var(--bw-gray)",
  positive: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  negative: "var(--bw-red)"
};
function ContentBadge({ children, tone = "signal", variant = "soft", size = "md", style, ...rest }) {
  const c = TONES[tone] || TONES.signal;
  const h = size === "sm" ? 18 : size === "lg" ? 26 : 22;
  const fs = size === "sm" ? 11 : size === "lg" ? 13 : 12;
  const looks = {
    solid: { background: c, color: "#fff", border: "1px solid transparent" },
    soft: { background: `color-mix(in srgb, ${c} 14%, var(--surface-card))`, color: c, border: "1px solid transparent" },
    outline: { background: "transparent", color: c, border: `1px solid color-mix(in srgb, ${c} 40%, var(--surface-card))` }
  }[variant] || {};
  return /* @__PURE__ */ jsx25(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        height: h,
        padding: "0 6px",
        fontFamily: "var(--font-sans)",
        fontSize: fs,
        fontWeight: "var(--fw-bold)",
        letterSpacing: "0.2px",
        borderRadius: "var(--radius-sm)",
        whiteSpace: "nowrap",
        ...looks,
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/content/Divider.jsx
import React27 from "react";
import { jsx as jsx26, jsxs as jsxs17 } from "react/jsx-runtime";
function Divider({ vertical = false, label, inset = 0, style, ...rest }) {
  if (vertical) {
    return /* @__PURE__ */ jsx26(
      "span",
      {
        role: "separator",
        "aria-orientation": "vertical",
        style: { display: "inline-block", width: 1, alignSelf: "stretch", minHeight: 16, background: "var(--line-neutral)", ...style },
        ...rest
      }
    );
  }
  if (label != null) {
    const rule = { flex: 1, height: 1, background: "var(--line-neutral)" };
    return /* @__PURE__ */ jsxs17("div", { role: "separator", style: { display: "flex", alignItems: "center", gap: 14, ...style }, ...rest, children: [
      /* @__PURE__ */ jsx26("span", { style: rule }),
      /* @__PURE__ */ jsx26("span", { style: { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--label-alternative)", whiteSpace: "nowrap" }, children: label }),
      /* @__PURE__ */ jsx26("span", { style: rule })
    ] });
  }
  return /* @__PURE__ */ jsx26("hr", { role: "separator", style: { border: "none", height: 1, background: "var(--line-neutral)", margin: `0 ${inset}px`, ...style }, ...rest });
}

// components/content/Kbd.jsx
import React28 from "react";
import { jsx as jsx27 } from "react/jsx-runtime";
function Kbd({ children, style, ...rest }) {
  return /* @__PURE__ */ jsx27(
    "kbd",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 22,
        height: 22,
        padding: "0 6px",
        fontFamily: "var(--font-sans)",
        fontSize: 12,
        fontWeight: "var(--fw-bold)",
        color: "var(--label-neutral)",
        background: "var(--surface-raised)",
        borderColor: "var(--border-subtle)",
        borderStyle: "solid",
        borderWidth: 1,
        borderBottomWidth: 2,
        borderRadius: "var(--radius-sm)",
        lineHeight: 1,
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/content/ListCell.jsx
import React29 from "react";
import { jsx as jsx28, jsxs as jsxs18 } from "react/jsx-runtime";
function ListCell({ leading, title, description, trailing, onClick, divider = false, style, ...rest }) {
  const clickable = !!onClick;
  const [hover, setHover] = React29.useState(false);
  const [focus, setFocus] = React29.useState(false);
  const dividerLeft = leading != null ? 62 : 14;
  const dividerRight = trailing != null ? 62 : 14;
  return /* @__PURE__ */ jsxs18(
    "div",
    {
      role: clickable ? "button" : void 0,
      tabIndex: clickable ? 0 : void 0,
      onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onFocus: () => setFocus(true),
      onBlur: () => setFocus(false),
      onKeyDown: clickable ? (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick(e);
        }
      } : void 0,
      style: {
        position: "relative",
        display: "flex",
        alignItems: "center",
        gap: 12,
        minHeight: 62,
        padding: "12px 14px",
        boxSizing: "border-box",
        cursor: clickable ? "pointer" : "default",
        background: clickable && hover ? "var(--lk-accent-tint)" : "transparent",
        borderRadius: "var(--radius-lg)",
        outline: focus ? "2px solid var(--focus-ring)" : "none",
        outlineOffset: -2,
        transition: "background var(--dur-fast) var(--ease-out), outline-color var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        leading != null && /* @__PURE__ */ jsx28(
          "div",
          {
            style: {
              width: 36,
              height: 36,
              flexShrink: 0,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--lk-accent-ink)",
              background: "var(--lk-accent-tint)",
              borderRadius: "var(--radius-md)"
            },
            children: leading
          }
        ),
        /* @__PURE__ */ jsxs18("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx28("div", { style: { fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-bold)", lineHeight: 1.35, letterSpacing: 0, color: "var(--label-normal)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: title }),
          description != null && /* @__PURE__ */ jsx28("div", { style: { marginTop: 3, fontFamily: "var(--font-sans)", fontSize: 12.5, lineHeight: 1.45, color: "var(--label-alternative)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: description })
        ] }),
        trailing != null && /* @__PURE__ */ jsx28("div", { style: { flexShrink: 0, display: "flex", alignItems: "center", gap: 8, color: "var(--label-alternative)" }, children: trailing }),
        divider && /* @__PURE__ */ jsx28(
          "span",
          {
            "aria-hidden": "true",
            style: {
              position: "absolute",
              left: dividerLeft,
              right: dividerRight,
              bottom: 0,
              height: 1,
              background: "var(--border-subtle)",
              opacity: 0.72,
              pointerEvents: "none"
            }
          }
        )
      ]
    }
  );
}

// components/content/Overline.jsx
import React30 from "react";
import { jsx as jsx29 } from "react/jsx-runtime";
function Overline({ children, as = "div", tone = "muted", onDark = false, style, ...rest }) {
  const Comp = as;
  const color = onDark ? tone === "signal" ? "var(--lk-accent)" : tone === "ink" ? "#fff" : "rgba(255,255,255,0.60)" : tone === "signal" ? "var(--accent-text)" : tone === "ink" ? "var(--label-strong)" : "var(--label-alternative)";
  return /* @__PURE__ */ jsx29(
    Comp,
    {
      style: {
        fontFamily: "var(--font-sans)",
        fontSize: "var(--fs-caption)",
        fontWeight: "var(--fw-bold)",
        letterSpacing: "var(--ls-overline)",
        textTransform: "uppercase",
        lineHeight: 1.2,
        color,
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/content/SourceTag.jsx
import React31 from "react";
import { jsx as jsx30, jsxs as jsxs19 } from "react/jsx-runtime";
var MONO3 = "var(--font-mono, ui-monospace, SFMono-Regular, Menlo, monospace)";
function SourceTag({ children, label = "SOURCE", href, tone = "default", style, ...rest }) {
  const isLink = href != null;
  const Comp = isLink ? "a" : "span";
  const [hover, setHover] = React31.useState(false);
  const onDark = tone === "onDark";
  return /* @__PURE__ */ jsxs19(
    Comp,
    {
      href,
      target: isLink ? "_blank" : void 0,
      rel: isLink ? "noopener noreferrer" : void 0,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        height: 26,
        paddingInline: 11,
        borderRadius: "var(--radius-pill)",
        background: onDark ? "rgba(255,255,255,0.10)" : "var(--fill-normal)",
        border: `1px solid ${onDark ? "rgba(255,255,255,0.16)" : "var(--line-normal)"}`,
        fontFamily: "var(--font-sans)",
        fontSize: 12.5,
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: isLink ? "pointer" : "default",
        color: onDark ? "rgba(255,255,255,0.90)" : "var(--label-neutral)",
        transition: "border-color var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx30("span", { style: { fontFamily: MONO3, fontSize: 10.5, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase", color: onDark ? "var(--lk-accent)" : "var(--accent-text)" }, children: label }),
        /* @__PURE__ */ jsx30("span", { "aria-hidden": "true", style: { width: 1, height: 12, background: "currentColor", opacity: 0.28 } }),
        /* @__PURE__ */ jsx30("span", { style: { fontWeight: 600 }, children }),
        isLink && /* @__PURE__ */ jsx30("span", { "aria-hidden": "true", style: { opacity: hover ? 1 : 0.55, transition: "opacity var(--dur-fast) var(--ease-out)" }, children: "\u2197" })
      ]
    }
  );
}

// components/content/StatusBadge.jsx
import React32 from "react";
import { jsx as jsx31, jsxs as jsxs20 } from "react/jsx-runtime";
var DOT = {
  positive: "var(--bw-green)",
  online: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  warning: "var(--bw-amber)",
  negative: "var(--bw-red)",
  offline: "var(--bw-gray-300)",
  signal: "var(--lk-accent-ink)",
  critical: "var(--color-danger-strong)"
};
function StatusBadge({ children, tone = "positive", pulse = false, style, ...rest }) {
  React32.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-status-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-status-kf";
    el.textContent = "@keyframes lk-status-pulse{0%{transform:scale(1);opacity:.55}70%{transform:scale(2.6);opacity:0}100%{opacity:0}}";
    document.head.appendChild(el);
  }, []);
  const c = DOT[tone] || DOT.positive;
  return /* @__PURE__ */ jsxs20(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        fontFamily: "var(--font-sans)",
        fontSize: 13,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        color: "var(--label-neutral)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx31("span", { style: { position: "relative", width: 8, height: 8, borderRadius: "50%", background: c, flexShrink: 0 }, children: (pulse || tone === "critical") && /* @__PURE__ */ jsx31("span", { style: { position: "absolute", inset: 0, borderRadius: "50%", background: c, animation: "lk-status-pulse 1.7s var(--ease-out) infinite" } }) }),
        children
      ]
    }
  );
}

// components/content/StepList.jsx
import React33 from "react";
import { jsx as jsx32, jsxs as jsxs21 } from "react/jsx-runtime";
function Mini({ children, onClick, disabled, label }) {
  return /* @__PURE__ */ jsx32(
    "button",
    {
      type: "button",
      onClick,
      disabled,
      title: label,
      "aria-label": label,
      style: {
        width: 28,
        height: 28,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-raised)",
        color: "var(--label-neutral)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.4 : 1,
        fontSize: 13
      },
      children
    }
  );
}
function StepList({ steps = [], onChange, editable = true, onAdd, addLabel = "\uB2E8\uACC4 \uCD94\uAC00", style, ...rest }) {
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= steps.length) return;
    const s = [...steps];
    const tmp = s[i];
    s[i] = s[j];
    s[j] = tmp;
    onChange && onChange(s);
  };
  const remove = (i) => {
    onChange && onChange(steps.filter((_, k) => k !== i));
  };
  return /* @__PURE__ */ jsxs21("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    steps.map((st, i) => /* @__PURE__ */ jsxs21("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "10px 12px", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-md)", background: "var(--surface-raised)", marginBottom: 8 }, children: [
      /* @__PURE__ */ jsx32("span", { style: { width: 24, height: 24, borderRadius: "50%", flexShrink: 0, display: "inline-flex", alignItems: "center", justifyContent: "center", background: "var(--lk-accent-tint)", color: "var(--lk-accent-ink)", fontSize: 12, fontWeight: 800, fontVariantNumeric: "tabular-nums" }, children: i + 1 }),
      /* @__PURE__ */ jsxs21("div", { style: { flex: 1, minWidth: 0 }, children: [
        /* @__PURE__ */ jsx32("div", { style: { fontSize: 14, fontWeight: 700, color: "var(--label-strong)" }, children: st.label }),
        st.detail != null && /* @__PURE__ */ jsx32("div", { style: { fontSize: 12.5, color: "var(--label-alternative)", marginTop: 1 }, children: st.detail })
      ] }),
      editable && /* @__PURE__ */ jsxs21("div", { style: { display: "inline-flex", gap: 2, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx32(Mini, { onClick: () => move(i, -1), disabled: i === 0, label: "\uC704\uB85C", children: "\u2191" }),
        /* @__PURE__ */ jsx32(Mini, { onClick: () => move(i, 1), disabled: i === steps.length - 1, label: "\uC544\uB798\uB85C", children: "\u2193" }),
        /* @__PURE__ */ jsx32(Mini, { onClick: () => remove(i), label: "\uC0AD\uC81C", children: "\u2715" })
      ] })
    ] }, st.id != null ? st.id : i)),
    editable && onAdd && /* @__PURE__ */ jsxs21(
      "button",
      {
        type: "button",
        onClick: onAdd,
        style: { width: "100%", padding: 10, border: "1px dashed var(--border-strong)", borderRadius: "var(--radius-md)", background: "transparent", color: "var(--label-alternative)", cursor: "pointer", fontSize: 13, fontWeight: 700, fontFamily: "var(--font-sans)" },
        children: [
          "+ ",
          addLabel
        ]
      }
    )
  ] });
}

// components/content/Thumbnail.jsx
import React34 from "react";
import { jsx as jsx33, jsxs as jsxs22 } from "react/jsx-runtime";
var toLen = (v) => typeof v === "number" ? v + "px" : v;
var ALIGN = {
  "top-left": { top: 8, left: 8 },
  "top-right": { top: 8, right: 8 },
  "bottom-left": { bottom: 8, left: 8 },
  "bottom-right": { bottom: 8, right: 8 }
};
function Thumbnail({
  src,
  alt = "",
  ratio = 1,
  radius = true,
  fit = "cover",
  overlay,
  overlayAlign = "top-left",
  style,
  children,
  ...rest
}) {
  const r = radius === true ? "var(--radius-md)" : radius === false ? "0" : toLen(radius);
  const pos = ALIGN[overlayAlign] || ALIGN["top-left"];
  return /* @__PURE__ */ jsxs22(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio: String(ratio),
        overflow: "hidden",
        borderRadius: r,
        background: "var(--fill-normal)",
        ...style
      },
      ...rest,
      children: [
        src && /* @__PURE__ */ jsx33("img", { src, alt, style: { width: "100%", height: "100%", objectFit: fit, display: "block" } }),
        (overlay || children) && /* @__PURE__ */ jsxs22("div", { style: { position: "absolute", display: "flex", gap: 6, ...pos }, children: [
          overlay,
          children
        ] })
      ]
    }
  );
}

// components/content/Timeline.jsx
import React35 from "react";
import { jsx as jsx34, jsxs as jsxs23 } from "react/jsx-runtime";
var DOT2 = {
  signal: "var(--lk-accent-ink)",
  positive: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  negative: "var(--bw-red)",
  neutral: "var(--bw-gray-300)"
};
function Timeline({ items = [], style, ...rest }) {
  return /* @__PURE__ */ jsx34("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => {
    const last = i === items.length - 1;
    const c = DOT2[it.tone] || DOT2.signal;
    return /* @__PURE__ */ jsxs23("div", { style: { display: "flex", gap: 14 }, children: [
      /* @__PURE__ */ jsxs23("div", { style: { display: "flex", flexDirection: "column", alignItems: "center" }, children: [
        /* @__PURE__ */ jsx34("span", { style: { width: 12, height: 12, borderRadius: "50%", background: c, border: "2px solid var(--bw-white)", boxShadow: `0 0 0 1px ${c}`, flexShrink: 0, marginTop: 4 } }),
        !last && /* @__PURE__ */ jsx34("span", { style: { flex: 1, width: 2, background: "var(--bw-border)", marginTop: 4 } })
      ] }),
      /* @__PURE__ */ jsxs23("div", { style: { paddingBottom: last ? 0 : 22 }, children: [
        it.time != null && /* @__PURE__ */ jsx34("div", { style: { fontSize: 12, fontWeight: "var(--fw-bold)", letterSpacing: "0.2px", color: "var(--label-assistive)", marginBottom: 3 }, children: it.time }),
        /* @__PURE__ */ jsx34("div", { style: { fontSize: 15.5, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)" }, children: it.title }),
        it.description != null && /* @__PURE__ */ jsx34("div", { style: { marginTop: 3, fontSize: 13.5, lineHeight: 1.6, color: "var(--label-alternative)", wordBreak: "keep-all" }, children: it.description })
      ] })
    ] }, i);
  }) });
}

// components/content/Tooltip.jsx
import React36 from "react";
import { jsx as jsx35, jsxs as jsxs24 } from "react/jsx-runtime";
function Tooltip({ content, placement = "top", children, style, ...rest }) {
  const [show, setShow] = React36.useState(false);
  const pos = {
    top: { bottom: "100%", left: "50%", transform: "translateX(-50%) translateY(-8px)" },
    bottom: { top: "100%", left: "50%", transform: "translateX(-50%) translateY(8px)" },
    left: { right: "100%", top: "50%", transform: "translateY(-50%) translateX(-8px)" },
    right: { left: "100%", top: "50%", transform: "translateY(-50%) translateX(8px)" }
  }[placement] || {};
  return /* @__PURE__ */ jsxs24(
    "span",
    {
      style: { position: "relative", display: "inline-flex", ...style },
      onMouseEnter: () => setShow(true),
      onMouseLeave: () => setShow(false),
      onFocus: () => setShow(true),
      onBlur: () => setShow(false),
      ...rest,
      children: [
        children,
        /* @__PURE__ */ jsx35(
          "span",
          {
            role: "tooltip",
            style: {
              position: "absolute",
              ...pos,
              zIndex: 40,
              pointerEvents: "none",
              padding: "7px 11px",
              background: "var(--surface-inverse)",
              color: "var(--text-on-inverse)",
              fontFamily: "var(--font-sans)",
              fontSize: 12.5,
              fontWeight: "var(--fw-semibold)",
              letterSpacing: 0,
              lineHeight: 1.4,
              borderRadius: "var(--radius-md)",
              whiteSpace: "nowrap",
              boxShadow: "var(--shadow-md)",
              opacity: show ? 1 : 0,
              transition: "opacity var(--dur-fast) var(--ease-out)"
            },
            children: content
          }
        )
      ]
    }
  );
}

// components/data/BarChart.jsx
import React37 from "react";
import { jsx as jsx36, jsxs as jsxs25 } from "react/jsx-runtime";
function BarChart({ data = [], height = 160, gap = 12, showValue = true, color = "var(--lk-accent-ink)", style, ...rest }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return /* @__PURE__ */ jsx36("div", { style: { display: "flex", alignItems: "flex-end", gap, height, fontFamily: "var(--font-sans)", ...style }, ...rest, children: data.map((d, i) => /* @__PURE__ */ jsxs25("div", { style: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8, height: "100%", justifyContent: "flex-end" }, children: [
    showValue && /* @__PURE__ */ jsx36("span", { style: { fontSize: 12, fontWeight: "var(--fw-bold)", color: "var(--label-neutral)", fontVariantNumeric: "tabular-nums" }, children: d.value }),
    /* @__PURE__ */ jsx36("div", { style: { width: "100%", maxWidth: 48, height: `${d.value / max * 100}%`, minHeight: 2, background: d.color || color, borderRadius: "var(--radius-md) var(--radius-md) 0 0", transition: "height var(--dur-slow) var(--ease-out)" } }),
    /* @__PURE__ */ jsx36("span", { style: { fontSize: 12, color: "var(--label-alternative)", whiteSpace: "nowrap" }, children: d.label })
  ] }, i)) });
}

// components/data/Calendar.jsx
import React38 from "react";
import { jsx as jsx37, jsxs as jsxs26 } from "react/jsx-runtime";
var WD = ["\uC77C", "\uC6D4", "\uD654", "\uC218", "\uBAA9", "\uAE08", "\uD1A0"];
function ymd(d) {
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}
function DayCell({ d, selected, today, onPick }) {
  const [h, setH] = React38.useState(false);
  const dow = d.getDay();
  const bg = selected ? "var(--lk-accent-ink)" : h ? "var(--fill-normal)" : "transparent";
  const color = selected ? "#fff" : dow === 0 ? "var(--bw-red)" : dow === 6 ? "var(--lk-accent-ink)" : "var(--label-normal)";
  return /* @__PURE__ */ jsx37(
    "button",
    {
      type: "button",
      onClick: () => onPick(d),
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: {
        height: 38,
        borderRadius: "var(--radius-md)",
        cursor: "pointer",
        border: today && !selected ? "1px solid var(--lk-accent-ink)" : "1px solid transparent",
        background: bg,
        color,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: selected ? "var(--fw-bold)" : "var(--fw-medium)",
        fontVariantNumeric: "tabular-nums",
        transition: "background var(--dur-fast) var(--ease-out)"
      },
      children: d.getDate()
    }
  );
}
function Calendar({ value, defaultValue, onChange, style, ...rest }) {
  const parse = (v) => v ? v instanceof Date ? v : new Date(v) : null;
  const isControlled = value !== void 0;
  const [internal, setInternal] = React38.useState(parse(defaultValue));
  const sel = isControlled ? parse(value) : internal;
  const now = /* @__PURE__ */ new Date();
  const [view, setView] = React38.useState(() => sel ? new Date(sel.getFullYear(), sel.getMonth(), 1) : new Date(now.getFullYear(), now.getMonth(), 1));
  const todayStr = ymd(now);
  const startDow = new Date(view.getFullYear(), view.getMonth(), 1).getDay();
  const days = new Date(view.getFullYear(), view.getMonth() + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDow; i++) cells.push(null);
  for (let dd = 1; dd <= days; dd++) cells.push(new Date(view.getFullYear(), view.getMonth(), dd));
  const pick = (d) => {
    if (!isControlled) setInternal(d);
    onChange && onChange(d);
  };
  const navMonth = (delta) => setView(new Date(view.getFullYear(), view.getMonth() + delta, 1));
  const navBtn = { width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", background: "var(--bw-white)", cursor: "pointer", color: "var(--label-neutral)" };
  return /* @__PURE__ */ jsxs26("div", { style: { width: 300, fontFamily: "var(--font-sans)", background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-xl)", padding: 16, ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs26("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }, children: [
      /* @__PURE__ */ jsxs26("div", { style: { fontSize: 16, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)" }, children: [
        view.getFullYear(),
        "\uB144 ",
        view.getMonth() + 1,
        "\uC6D4"
      ] }),
      /* @__PURE__ */ jsxs26("div", { style: { display: "flex", gap: 4 }, children: [
        /* @__PURE__ */ jsx37("button", { type: "button", "aria-label": "previous month", onClick: () => navMonth(-1), style: navBtn, children: /* @__PURE__ */ jsx37("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx37("path", { d: "m15 18-6-6 6-6" }) }) }),
        /* @__PURE__ */ jsx37("button", { type: "button", "aria-label": "next month", onClick: () => navMonth(1), style: navBtn, children: /* @__PURE__ */ jsx37("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx37("path", { d: "m9 18 6-6-6-6" }) }) })
      ] })
    ] }),
    /* @__PURE__ */ jsx37("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2, marginBottom: 6 }, children: WD.map((w, i) => /* @__PURE__ */ jsx37("div", { style: { textAlign: "center", fontSize: 12, fontWeight: "var(--fw-semibold)", color: i === 0 ? "var(--bw-red)" : i === 6 ? "var(--lk-accent-ink)" : "var(--label-assistive)" }, children: w }, w)) }),
    /* @__PURE__ */ jsx37("div", { style: { display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }, children: cells.map((d, i) => d ? /* @__PURE__ */ jsx37(DayCell, { d, selected: sel && ymd(sel) === ymd(d), today: todayStr === ymd(d), onPick: pick }, i) : /* @__PURE__ */ jsx37("span", {}, i)) })
  ] });
}

// components/data/Carousel.jsx
import React39 from "react";
import { jsx as jsx38, jsxs as jsxs27 } from "react/jsx-runtime";
function navBtnStyle(side) {
  return { position: "absolute", top: "50%", [side]: 12, transform: "translateY(-50%)", width: 40, height: 40, borderRadius: "50%", border: "none", background: "rgba(14,19,41,0.5)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)", zIndex: 2 };
}
function Carousel({ slides = [], showDots = true, showArrows = true, style, ...rest }) {
  const [i, setI] = React39.useState(0);
  const n = slides.length;
  const go = (d) => setI((p) => (p + d + n) % n);
  return /* @__PURE__ */ jsxs27("div", { style: { position: "relative", overflow: "hidden", borderRadius: "var(--radius-2xl)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx38("div", { style: { display: "flex", transform: `translateX(-${i * 100}%)`, transition: "transform var(--dur-slow) var(--ease-out)" }, children: slides.map((s, idx) => /* @__PURE__ */ jsx38("div", { style: { flex: "0 0 100%", minWidth: "100%" }, children: s }, idx)) }),
    showArrows && n > 1 && /* @__PURE__ */ jsxs27(React39.Fragment, { children: [
      /* @__PURE__ */ jsx38("button", { type: "button", "aria-label": "previous", onClick: () => go(-1), style: navBtnStyle("left"), children: /* @__PURE__ */ jsx38("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx38("path", { d: "m15 18-6-6 6-6" }) }) }),
      /* @__PURE__ */ jsx38("button", { type: "button", "aria-label": "next", onClick: () => go(1), style: navBtnStyle("right"), children: /* @__PURE__ */ jsx38("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx38("path", { d: "m9 18 6-6-6-6" }) }) })
    ] }),
    showDots && n > 1 && /* @__PURE__ */ jsx38("div", { style: { position: "absolute", bottom: 14, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 8, zIndex: 2 }, children: slides.map((_, idx) => /* @__PURE__ */ jsx38("button", { type: "button", "aria-label": `slide ${idx + 1}`, onClick: () => setI(idx), style: { width: idx === i ? 22 : 8, height: 8, borderRadius: "var(--radius-pill)", border: "none", cursor: "pointer", padding: 0, background: idx === i ? "var(--bw-white)" : "rgba(255,255,255,0.5)", transition: "width var(--dur-base) var(--ease-out)" } }, idx)) })
  ] });
}

// components/data/DataGrid.jsx
import React40 from "react";
import { jsx as jsx39, jsxs as jsxs28 } from "react/jsx-runtime";
function sortRows(rows, key, dir) {
  if (!key) return rows;
  const s = [...rows].sort((a, b) => {
    const x = a[key];
    const y = b[key];
    if (x == null) return 1;
    if (y == null) return -1;
    if (typeof x === "number" && typeof y === "number") return x - y;
    return String(x).localeCompare(String(y), "ko");
  });
  return dir === "desc" ? s.reverse() : s;
}
function DataGrid({ columns = [], rows = [], selectable = false, onSelectionChange, size = "md", style, ...rest }) {
  const [sort, setSort] = React40.useState({ key: null, dir: "asc" });
  const [sel, setSel] = React40.useState(() => /* @__PURE__ */ new Set());
  const pad2 = size === "sm" ? "10px 12px" : "13px 16px";
  const sorted = sortRows(rows, sort.key, sort.dir);
  const toggleSort = (c) => {
    if (!c.sortable) return;
    setSort((s) => s.key === c.key ? { key: c.key, dir: s.dir === "asc" ? "desc" : "asc" } : { key: c.key, dir: "asc" });
  };
  const emit = (n) => {
    onSelectionChange && onSelectionChange([...n]);
  };
  const toggleRow = (i) => setSel((prev) => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i);
    else n.add(i);
    emit(n);
    return n;
  });
  const toggleAll = () => setSel((prev) => {
    const n = prev.size === sorted.length ? /* @__PURE__ */ new Set() : new Set(sorted.map((_, i) => i));
    emit(n);
    return n;
  });
  const allOn = selectable && sorted.length > 0 && sel.size === sorted.length;
  return /* @__PURE__ */ jsx39("div", { style: { overflowX: "auto", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", ...style }, ...rest, children: /* @__PURE__ */ jsxs28("table", { style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }, children: [
    /* @__PURE__ */ jsx39("thead", { children: /* @__PURE__ */ jsxs28("tr", { children: [
      selectable && /* @__PURE__ */ jsx39("th", { style: { padding: pad2, borderBottom: "1px solid var(--bw-border)", width: 44 }, children: /* @__PURE__ */ jsx39("input", { type: "checkbox", checked: allOn, onChange: toggleAll, "aria-label": "select all" }) }),
      columns.map((c) => /* @__PURE__ */ jsx39("th", { onClick: () => toggleSort(c), style: { textAlign: c.align || "left", padding: pad2, borderBottom: "1px solid var(--bw-border)", fontSize: 12, fontWeight: "var(--fw-bold)", letterSpacing: "0.4px", textTransform: "uppercase", color: "var(--label-alternative)", cursor: c.sortable ? "pointer" : "default", whiteSpace: "nowrap", userSelect: "none" }, children: /* @__PURE__ */ jsxs28("span", { style: { display: "inline-flex", alignItems: "center", gap: 5 }, children: [
        c.label,
        c.sortable && /* @__PURE__ */ jsx39("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: sort.key === c.key ? 1 : 0.3 }, children: /* @__PURE__ */ jsx39("path", { d: sort.key === c.key && sort.dir === "desc" ? "m6 9 6 6 6-6" : "m6 15 6-6 6 6" }) })
      ] }) }, c.key))
    ] }) }),
    /* @__PURE__ */ jsx39("tbody", { children: sorted.map((r, ri) => /* @__PURE__ */ jsxs28("tr", { style: { background: sel.has(ri) ? "var(--lk-accent-tint)" : "transparent" }, children: [
      selectable && /* @__PURE__ */ jsx39("td", { style: { padding: pad2, borderBottom: "1px solid var(--bw-border)" }, children: /* @__PURE__ */ jsx39("input", { type: "checkbox", checked: sel.has(ri), onChange: () => toggleRow(ri), "aria-label": `select row ${ri + 1}` }) }),
      columns.map((c) => /* @__PURE__ */ jsx39("td", { style: { textAlign: c.align || "left", padding: pad2, borderBottom: "1px solid var(--bw-border)", fontSize: 14.5, color: "var(--label-neutral)", whiteSpace: "nowrap" }, children: typeof c.render === "function" ? c.render(r) : r[c.key] }, c.key))
    ] }, ri)) })
  ] }) });
}

// components/data/DescriptionList.jsx
import React41 from "react";
import { jsx as jsx40, jsxs as jsxs29 } from "react/jsx-runtime";
function DescriptionList({ items = [], columns = 1, style, ...rest }) {
  return /* @__PURE__ */ jsx40("dl", { style: { margin: 0, display: "grid", gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, columnGap: 32, fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it, i) => /* @__PURE__ */ jsxs29("div", { style: { display: "flex", gap: 16, padding: "12px 0", borderBottom: "1px solid var(--bw-border)" }, children: [
    /* @__PURE__ */ jsx40("dt", { style: { flex: "0 0 34%", fontSize: 14, fontWeight: "var(--fw-semibold)", color: "var(--label-alternative)" }, children: it.term }),
    /* @__PURE__ */ jsx40("dd", { style: { margin: 0, flex: 1, fontSize: 14.5, fontWeight: "var(--fw-semibold)", color: "var(--label-normal)", wordBreak: "keep-all" }, children: it.description })
  ] }, i)) });
}

// components/data/DonutChart.jsx
import React42 from "react";
import { jsx as jsx41, jsxs as jsxs30 } from "react/jsx-runtime";
var PALETTE = ["var(--lk-accent-ink)", "var(--bw-blue)", "var(--bw-amber)", "var(--bw-green)", "var(--bw-red)", "var(--bw-gray-300)"];
function DonutChart({ segments = [], size = 140, thickness = 18, showTotal = true, centerLabel, legend = true, style, ...rest }) {
  const total = segments.reduce((s, x) => s + (x.value || 0), 0) || 1;
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  return /* @__PURE__ */ jsxs30("div", { style: { display: "inline-flex", alignItems: "center", gap: 20, ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs30("span", { style: { position: "relative", width: size, height: size }, children: [
      /* @__PURE__ */ jsxs30("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" }, children: [
        /* @__PURE__ */ jsx41("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--fill-strong)", strokeWidth: thickness }),
        segments.map((s, i) => {
          const dash = (s.value || 0) / total * circ;
          const el = /* @__PURE__ */ jsx41("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: s.color || PALETTE[i % PALETTE.length], strokeWidth: thickness, strokeDasharray: `${dash} ${circ - dash}`, strokeDashoffset: -offset }, i);
          offset += dash;
          return el;
        })
      ] }),
      (showTotal || centerLabel != null) && /* @__PURE__ */ jsx41("span", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: size * 0.2, fontWeight: "var(--fw-extra)", color: "var(--label-normal)", fontVariantNumeric: "tabular-nums" }, children: centerLabel != null ? centerLabel : total })
    ] }),
    legend && segments.length > 0 && /* @__PURE__ */ jsx41("div", { style: { display: "flex", flexDirection: "column", gap: 8 }, children: segments.map((s, i) => /* @__PURE__ */ jsxs30("span", { style: { display: "inline-flex", alignItems: "center", gap: 8, fontFamily: "var(--font-sans)", fontSize: 13, color: "var(--label-neutral)" }, children: [
      /* @__PURE__ */ jsx41("span", { style: { width: 10, height: 10, borderRadius: 3, background: s.color || PALETTE[i % PALETTE.length] } }),
      s.label,
      /* @__PURE__ */ jsxs30("b", { style: { marginLeft: 2, color: "var(--label-normal)" }, children: [
        Math.round(s.value / total * 100),
        "%"
      ] })
    ] }, i)) })
  ] });
}

// components/data/Sparkline.jsx
import React43 from "react";
import { jsx as jsx42, jsxs as jsxs31 } from "react/jsx-runtime";
function Sparkline({ data = [], width = 120, height = 32, color = "var(--lk-accent-ink)", fill = true, strokeWidth = 2, style, ...rest }) {
  if (!data.length) return /* @__PURE__ */ jsx42("svg", { width, height, style, ...rest });
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((d, i) => [i / (data.length - 1 || 1) * width, height - (d - min) / range * (height - 4) - 2]);
  const line = pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
  const area = `${line} L${width} ${height} L0 ${height} Z`;
  return /* @__PURE__ */ jsxs31("svg", { width, height, viewBox: `0 0 ${width} ${height}`, style: { display: "block", ...style }, ...rest, children: [
    fill && /* @__PURE__ */ jsx42("path", { d: area, fill: color, opacity: "0.12" }),
    /* @__PURE__ */ jsx42("path", { d: line, fill: "none", stroke: color, strokeWidth, strokeLinecap: "round", strokeLinejoin: "round" })
  ] });
}

// components/data/Table.jsx
import React44 from "react";
import { jsx as jsx43, jsxs as jsxs32 } from "react/jsx-runtime";
function TableRow({ columns, row, pad: pad2, hover }) {
  const [h, setH] = React44.useState(false);
  return /* @__PURE__ */ jsx43(
    "tr",
    {
      onMouseEnter: () => setH(true),
      onMouseLeave: () => setH(false),
      style: { background: hover && h ? "var(--fill-alt)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" },
      children: columns.map((c) => /* @__PURE__ */ jsx43("td", { style: { textAlign: c.align || "left", padding: pad2, borderBottom: "1px solid var(--bw-border)", fontSize: 14.5, color: "var(--label-neutral)", whiteSpace: "nowrap" }, children: typeof c.render === "function" ? c.render(row) : row[c.key] }, c.key))
    }
  );
}
function Table({ columns = [], rows = [], size = "md", hover = true, style, ...rest }) {
  const pad2 = size === "sm" ? "10px 12px" : "14px 16px";
  return /* @__PURE__ */ jsx43("div", { style: { overflowX: "auto", ...style }, ...rest, children: /* @__PURE__ */ jsxs32("table", { style: { width: "100%", borderCollapse: "collapse", fontFamily: "var(--font-sans)" }, children: [
    /* @__PURE__ */ jsx43("thead", { children: /* @__PURE__ */ jsx43("tr", { children: columns.map((c) => /* @__PURE__ */ jsx43("th", { style: { textAlign: c.align || "left", padding: pad2, borderBottom: "1px solid var(--bw-border)", fontSize: 12, fontWeight: "var(--fw-bold)", letterSpacing: "0.4px", textTransform: "uppercase", color: "var(--label-alternative)", width: c.width, whiteSpace: "nowrap" }, children: c.label }, c.key)) }) }),
    /* @__PURE__ */ jsx43("tbody", { children: rows.map((r, ri) => /* @__PURE__ */ jsx43(TableRow, { columns, row: r, pad: pad2, hover }, ri)) })
  ] }) });
}

// components/data/Tree.jsx
import React45 from "react";
import { jsx as jsx44, jsxs as jsxs33 } from "react/jsx-runtime";
function TreeNode({ node, level, expandedSet, toggle, onSelect }) {
  const key = node.id != null ? node.id : node.label;
  const has = node.children && node.children.length > 0;
  const open = expandedSet.has(key);
  return /* @__PURE__ */ jsxs33("div", { children: [
    /* @__PURE__ */ jsxs33(
      "button",
      {
        type: "button",
        onClick: () => {
          if (has) toggle(key);
          onSelect && onSelect(node);
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "var(--fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: { width: "100%", display: "flex", alignItems: "center", gap: 7, padding: "7px 8px", paddingLeft: 8 + level * 18, border: "none", background: "transparent", cursor: "pointer", borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 14.5, color: "var(--label-normal)" },
        children: [
          has ? /* @__PURE__ */ jsx44("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-alternative)", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", style: { transform: open ? "rotate(90deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)", flexShrink: 0 }, children: /* @__PURE__ */ jsx44("path", { d: "m9 18 6-6-6-6" }) }) : /* @__PURE__ */ jsx44("span", { style: { width: 14, flexShrink: 0 } }),
          node.icon,
          /* @__PURE__ */ jsx44("span", { children: node.label })
        ]
      }
    ),
    has && open && node.children.map((c, i) => /* @__PURE__ */ jsx44(TreeNode, { node: c, level: level + 1, expandedSet, toggle, onSelect }, i))
  ] });
}
function Tree({ nodes = [], defaultExpanded = [], onSelect, style, ...rest }) {
  const [expanded, setExpanded] = React45.useState(() => new Set(defaultExpanded));
  const toggle = (k) => setExpanded((prev) => {
    const n = new Set(prev);
    if (n.has(k)) n.delete(k);
    else n.add(k);
    return n;
  });
  return /* @__PURE__ */ jsx44("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: nodes.map((n, i) => /* @__PURE__ */ jsx44(TreeNode, { node: n, level: 0, expandedSet: expanded, toggle, onSelect }, i)) });
}

// components/editor/CanvasEditorShell.jsx
import React46 from "react";
import { jsx as jsx45, jsxs as jsxs34 } from "react/jsx-runtime";
function CanvasEditorShell({ title, tools, children, panel, status, panelWidth = 280, style, ...rest }) {
  return /* @__PURE__ */ jsxs34("div", { style: {
    display: "flex",
    flexDirection: "column",
    height: "100%",
    minHeight: 320,
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    background: "var(--surface-raised)",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: [
    title != null && /* @__PURE__ */ jsx45("div", { style: { display: "flex", alignItems: "center", gap: 10, padding: "10px 14px", borderBottom: "1px solid var(--bw-band)", fontSize: 13, fontWeight: 700, color: "var(--label-strong)" }, children: title }),
    /* @__PURE__ */ jsxs34("div", { style: { display: "flex", flex: 1, minHeight: 0 }, children: [
      tools != null && /* @__PURE__ */ jsx45("div", { style: { display: "flex", flexDirection: "column", gap: 4, padding: 8, borderRight: "1px solid var(--bw-band)", background: "var(--surface-subtle)" }, children: tools }),
      /* @__PURE__ */ jsx45("div", { style: { flex: 1, minWidth: 0, position: "relative", background: "var(--surface-sunken)" }, children }),
      panel != null && /* @__PURE__ */ jsx45("div", { style: { width: panelWidth, flexShrink: 0, borderLeft: "1px solid var(--bw-band)", overflow: "auto", background: "var(--surface-raised)" }, children: panel })
    ] }),
    status != null && /* @__PURE__ */ jsx45("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "6px 14px", borderTop: "1px solid var(--bw-band)", fontSize: 12, color: "var(--label-alternative)", background: "var(--surface-subtle)" }, children: status })
  ] });
}

// components/editor/EditorToolbar.jsx
import React47 from "react";
import { jsx as jsx46 } from "react/jsx-runtime";
function EditorToolbar({ items = [], value, defaultValue, onChange, orientation = "vertical", style, ...rest }) {
  const controlled = value !== void 0;
  const first = items[0] && (items[0].value != null ? items[0].value : items[0]);
  const [internal, setInternal] = React47.useState(defaultValue != null ? defaultValue : first);
  const cur = controlled ? value : internal;
  const pick = (v) => {
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx46("div", { style: { display: "inline-flex", flexDirection: orientation === "vertical" ? "column" : "row", gap: 3, ...style }, ...rest, children: items.map((it, i) => {
    const v = it.value != null ? it.value : it;
    const on = v === cur;
    return /* @__PURE__ */ jsx46(
      "button",
      {
        type: "button",
        title: it.label || v,
        "aria-label": it.label || v,
        "aria-pressed": on,
        onClick: () => pick(v),
        style: {
          width: 38,
          height: 38,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          background: on ? "var(--lk-accent-ink)" : "var(--surface-raised)",
          color: on ? "#fff" : "var(--label-neutral)",
          boxShadow: on ? "none" : "inset 0 0 0 1px var(--border-subtle)",
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: it.icon || v
      },
      i
    );
  }) });
}

// components/editor/HistoryToolbar.jsx
import React48 from "react";
import { jsx as jsx47, jsxs as jsxs35 } from "react/jsx-runtime";
function HistoryToolbar({ canUndo = false, canRedo = false, onUndo, onRedo, onReset, count, style, ...rest }) {
  const base = {
    width: 34,
    height: 34,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-sm)",
    background: "var(--surface-raised)",
    color: "var(--label-neutral)",
    fontSize: 15,
    fontWeight: 700
  };
  return /* @__PURE__ */ jsxs35("div", { style: { display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx47("button", { type: "button", disabled: !canUndo, onClick: onUndo, title: "\uC2E4\uD589 \uCDE8\uC18C", "aria-label": "\uC2E4\uD589 \uCDE8\uC18C", style: { ...base, cursor: canUndo ? "pointer" : "not-allowed", opacity: canUndo ? 1 : 0.4 }, children: "\u21B6" }),
    /* @__PURE__ */ jsx47("button", { type: "button", disabled: !canRedo, onClick: onRedo, title: "\uB2E4\uC2DC \uC2E4\uD589", "aria-label": "\uB2E4\uC2DC \uC2E4\uD589", style: { ...base, cursor: canRedo ? "pointer" : "not-allowed", opacity: canRedo ? 1 : 0.4 }, children: "\u21B7" }),
    onReset && /* @__PURE__ */ jsx47("button", { type: "button", onClick: onReset, title: "\uCD08\uAE30\uD654", "aria-label": "\uCD08\uAE30\uD654", style: { ...base, cursor: "pointer" }, children: "\u27F2" }),
    typeof count === "number" && /* @__PURE__ */ jsxs35("span", { style: { fontSize: 11.5, color: "var(--label-assistive)", fontVariantNumeric: "tabular-nums", marginLeft: 4 }, children: [
      count,
      " \uB2E8\uACC4"
    ] })
  ] });
}

// components/feedback/Avatar.jsx
import React49 from "react";
import { jsx as jsx48, jsxs as jsxs36 } from "react/jsx-runtime";
function Avatar({
  src,
  alt = "",
  name,
  size = 48,
  status,
  ring = false,
  style,
  ...rest
}) {
  const initials = name ? name.split(" ").map((p) => p[0]).slice(0, 2).join("").toUpperCase() : "";
  const statusColor = status === "online" ? "var(--lk-accent-ink)" : status === "busy" ? "var(--bw-red)" : "var(--bw-gray-300)";
  return /* @__PURE__ */ jsxs36("span", { style: { position: "relative", display: "inline-flex", width: size, height: size, ...style }, ...rest, children: [
    src ? /* @__PURE__ */ jsx48(
      "img",
      {
        src,
        alt,
        width: size,
        height: size,
        style: { width: size, height: size, objectFit: "cover", borderRadius: "var(--radius-pill)", boxShadow: ring ? "0 0 0 4px var(--bw-white), 0 0 0 5px var(--bw-border)" : "none" }
      }
    ) : /* @__PURE__ */ jsx48("span", { style: {
      width: size,
      height: size,
      borderRadius: "var(--radius-pill)",
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bw-indigo-tint)",
      color: "var(--bw-ink)",
      fontFamily: "var(--font-sans)",
      fontWeight: "var(--fw-bold)",
      fontSize: Math.round(size * 0.38)
    }, children: initials }),
    status && /* @__PURE__ */ jsx48("span", { style: {
      position: "absolute",
      right: 0,
      bottom: 0,
      width: Math.max(10, size * 0.24),
      height: Math.max(10, size * 0.24),
      background: statusColor,
      borderRadius: "50%",
      border: "2px solid var(--bw-white)"
    } })
  ] });
}

// components/feedback/AvatarGroup.jsx
import React50 from "react";
import { jsx as jsx49, jsxs as jsxs37 } from "react/jsx-runtime";
function AvatarGroup({ items = [], max = 4, size = 36, style, ...rest }) {
  const shown = items.slice(0, max);
  const extra = items.length - shown.length;
  const overlap = -Math.round(size * 0.3);
  const base = {
    width: size,
    height: size,
    borderRadius: "50%",
    border: "2px solid var(--bw-white)",
    boxSizing: "border-box",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    flexShrink: 0,
    fontFamily: "var(--font-sans)",
    fontSize: Math.round(size * 0.36),
    fontWeight: "var(--fw-bold)"
  };
  return /* @__PURE__ */ jsxs37("div", { style: { display: "inline-flex", alignItems: "center", ...style }, ...rest, children: [
    shown.map((it, i) => /* @__PURE__ */ jsx49("span", { title: it.name, style: { ...base, marginLeft: i ? overlap : 0, background: it.src ? "var(--bw-mist)" : "var(--lk-accent-tint-2)", color: "var(--lk-accent-ink)", zIndex: i }, children: it.src ? /* @__PURE__ */ jsx49("img", { src: it.src, alt: it.name || "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : it.name ? String(it.name).slice(0, 1) : "" }, i)),
    extra > 0 && /* @__PURE__ */ jsxs37("span", { style: { ...base, marginLeft: overlap, background: "var(--surface-inverse)", color: "var(--text-on-inverse)", zIndex: shown.length }, children: [
      "+",
      extra
    ] })
  ] });
}

// components/feedback/Badge.jsx
import React51 from "react";
import { jsx as jsx50 } from "react/jsx-runtime";
var COLORS = {
  signal: "var(--lk-accent-ink)",
  navy: "var(--surface-inverse)",
  steel: "var(--bw-blue)",
  amber: "var(--bw-amber)",
  red: "var(--bw-red)",
  // aliases
  indigo: "var(--surface-inverse)",
  green: "var(--bw-blue)",
  ink: "var(--surface-inverse)"
};
function Badge({ children, tone = "signal", dot = false, style, ...rest }) {
  const c = COLORS[tone] || COLORS.signal;
  if (dot) {
    return /* @__PURE__ */ jsx50("span", { style: { display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: c, ...style }, ...rest });
  }
  return /* @__PURE__ */ jsx50(
    "span",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        minWidth: 20,
        height: 20,
        padding: "0 7px",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-bold)",
        fontSize: 12,
        color: "#fff",
        background: c,
        borderRadius: "var(--radius-pill)",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/feedback/Chip.jsx
import React52 from "react";
import { jsx as jsx51 } from "react/jsx-runtime";
function Chip({
  children,
  as = "span",
  selected = false,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const [hover, setHover] = React52.useState(false);
  const active = selected || hover;
  const Comp = as;
  return /* @__PURE__ */ jsx51(
    Comp,
    {
      onMouseEnter: (e) => {
        setHover(true);
        onMouseEnter && onMouseEnter(e);
      },
      onMouseLeave: (e) => {
        setHover(false);
        onMouseLeave && onMouseLeave(e);
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        height: 32,
        paddingInline: 8,
        background: selected ? "var(--lk-accent-tint-2)" : "var(--bw-white)",
        border: `1px solid ${active ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
        borderRadius: "var(--radius-8)",
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: "var(--fw-medium)",
        letterSpacing: "0.015em",
        color: active ? "var(--lk-accent-ink)" : "var(--bw-ink)",
        whiteSpace: "nowrap",
        textDecoration: "none",
        cursor: as === "a" || rest.onClick ? "pointer" : "default",
        transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/feedback/Notification.jsx
import React53 from "react";
import { jsx as jsx52, jsxs as jsxs38 } from "react/jsx-runtime";
function Notification({ icon, title, description, time, unread = false, onClick, style, ...rest }) {
  return /* @__PURE__ */ jsxs38(
    "div",
    {
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onClick,
      style: { display: "flex", gap: 12, padding: "14px 16px", borderRadius: "var(--radius-lg)", cursor: onClick ? "pointer" : "default", background: unread ? "var(--lk-accent-tint)" : "transparent", fontFamily: "var(--font-sans)", ...style },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ jsx52("span", { style: { flexShrink: 0, width: 38, height: 38, borderRadius: "var(--radius-md)", background: "var(--bw-white)", border: "1px solid var(--bw-border)", display: "inline-flex", alignItems: "center", justifyContent: "center", color: "var(--lk-accent-ink)" }, children: icon }),
        /* @__PURE__ */ jsxs38("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsxs38("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
            /* @__PURE__ */ jsx52("span", { style: { fontSize: 14.5, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)" }, children: title }),
            unread && /* @__PURE__ */ jsx52("span", { style: { width: 7, height: 7, borderRadius: "50%", background: "var(--bw-red)", flexShrink: 0 } })
          ] }),
          description != null && /* @__PURE__ */ jsx52("div", { style: { marginTop: 2, fontSize: 13, lineHeight: 1.55, color: "var(--label-alternative)", wordBreak: "keep-all" }, children: description }),
          time != null && /* @__PURE__ */ jsx52("div", { style: { marginTop: 4, fontSize: 12, color: "var(--label-assistive)" }, children: time })
        ] })
      ]
    }
  );
}

// components/feedback/PushBadge.jsx
import React54 from "react";
import { jsx as jsx53, jsxs as jsxs39 } from "react/jsx-runtime";
function PushBadge({ children, count, dot = false, max = 99, tone = "negative", style, ...rest }) {
  const c = tone === "signal" ? "var(--lk-accent-ink)" : tone === "navy" ? "var(--surface-inverse)" : "var(--bw-red)";
  const show = dot || count != null && count > 0;
  const label = count > max ? `${max}+` : count;
  return /* @__PURE__ */ jsxs39("span", { style: { position: "relative", display: "inline-flex", ...style }, ...rest, children: [
    children,
    show && (dot ? /* @__PURE__ */ jsx53("span", { style: { position: "absolute", top: -1, right: -1, width: 9, height: 9, borderRadius: "50%", background: c, border: "2px solid var(--bw-white)", boxSizing: "content-box" } }) : /* @__PURE__ */ jsx53("span", { style: { position: "absolute", top: -7, right: -9, minWidth: 18, height: 18, padding: "0 5px", display: "inline-flex", alignItems: "center", justifyContent: "center", background: c, color: "#fff", borderRadius: "var(--radius-pill)", border: "2px solid var(--bw-white)", boxSizing: "content-box", fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: "var(--fw-bold)", lineHeight: 1, fontVariantNumeric: "tabular-nums" }, children: label }))
  ] });
}

// components/feedback/Rating.jsx
import React55 from "react";
import { jsx as jsx54 } from "react/jsx-runtime";
function Rating({ value, defaultValue = 0, max = 5, onChange, size = 20, readOnly = false, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React55.useState(defaultValue);
  const [hover, setHover] = React55.useState(null);
  const val = isControlled ? value : internal;
  const shown = hover != null ? hover : val;
  const set = (v) => {
    if (readOnly) return;
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx54("span", { style: { display: "inline-flex", gap: 2, ...style }, ...rest, children: Array.from({ length: max }).map((_, i) => {
    const filled = i < shown;
    return /* @__PURE__ */ jsx54(
      "span",
      {
        onMouseEnter: () => {
          if (!readOnly) setHover(i + 1);
        },
        onMouseLeave: () => {
          if (!readOnly) setHover(null);
        },
        onClick: () => set(i + 1),
        style: { display: "inline-flex", cursor: readOnly ? "default" : "pointer", color: filled ? "var(--bw-amber)" : "var(--bw-gray-300)" },
        children: /* @__PURE__ */ jsx54("svg", { width: size, height: size, viewBox: "0 0 24 24", fill: filled ? "currentColor" : "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx54("path", { d: "M12 2.5l2.9 5.9 6.5.95-4.7 4.6 1.1 6.5L12 18.6 6.2 21l1.1-6.5-4.7-4.6 6.5-.95z" }) })
      },
      i
    );
  }) });
}

// components/feedback/Tag.jsx
import React56 from "react";
import { jsx as jsx55 } from "react/jsx-runtime";
var TONES2 = {
  signal: { fg: "var(--lk-accent-ink)", bg: "var(--lk-accent-tint-2)" },
  // brand teal chip (default)
  neutral: { fg: "var(--label-strong)", bg: "var(--fill-strong)", solidBg: "var(--surface-inverse)" },
  // ink neutral
  steel: { fg: "var(--bw-green-600)", bg: "rgba(94,110,134,0.14)" },
  amber: { fg: "#9A7424", bg: "rgba(194,154,82,0.18)" },
  red: { fg: "var(--bw-red)", bg: "rgba(207,99,96,0.14)" },
  // back-compat aliases (live site uses tone="indigo")
  indigo: { fg: "var(--label-strong)", bg: "var(--fill-strong)", solidBg: "var(--surface-inverse)" },
  green: { fg: "var(--bw-green-600)", bg: "rgba(94,110,134,0.14)" },
  ink: { fg: "var(--label-strong)", bg: "var(--fill-strong)", solidBg: "var(--surface-inverse)" }
};
function Tag({ children, tone = "signal", solid = false, style, ...rest }) {
  const t = TONES2[tone] || TONES2.signal;
  return /* @__PURE__ */ jsx55(
    "span",
    {
      className: `lk-tag lk-tag--${tone}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: 26,
        padding: "0 12px",
        fontFamily: "var(--font-sans)",
        fontWeight: "var(--fw-bold)",
        fontSize: "var(--fs-caption)",
        lineHeight: 1,
        letterSpacing: "var(--ls-caption)",
        textTransform: "uppercase",
        whiteSpace: "nowrap",
        color: solid ? "#fff" : t.fg,
        background: solid ? t.solidBg || t.fg : t.bg,
        borderRadius: "var(--radius-pill)",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/forms/AutoComplete.jsx
import React57 from "react";
import { jsx as jsx56, jsxs as jsxs40 } from "react/jsx-runtime";
function AutoComplete({ options = [], value, defaultValue, onChange, onSelect, placeholder = "\uC785\uB825\uD558\uC138\uC694", size = "md", style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React57.useState(defaultValue || "");
  const [open, setOpen] = React57.useState(false);
  const val = isControlled ? value : internal;
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const filtered = val ? norm.filter((o) => String(o.label).toLowerCase().includes(String(val).toLowerCase())) : norm;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const pick = (o) => {
    set(o.label);
    onSelect && onSelect(o.value);
    setOpen(false);
  };
  const h = size === "sm" ? 40 : 48;
  return /* @__PURE__ */ jsxs40("div", { style: { position: "relative", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx56(
      "input",
      {
        value: val,
        placeholder,
        "aria-label": ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uC785\uB825"),
        onChange: (e) => {
          set(e.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        onBlur: () => setTimeout(() => setOpen(false), 120),
        style: { width: "100%", height: h, padding: "0 16px", boxSizing: "border-box", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-input)", outline: "none", fontFamily: "var(--font-sans)", fontSize: 16, color: "var(--label-normal)", background: "var(--bw-white)" }
      }
    ),
    open && filtered.length > 0 && /* @__PURE__ */ jsx56("div", { role: "listbox", style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 30, maxHeight: 240, overflowY: "auto", background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-xl)", boxShadow: "var(--shadow-md)", padding: 6 }, children: filtered.map((o, i) => /* @__PURE__ */ jsx56(
      "div",
      {
        role: "option",
        onMouseDown: (e) => {
          e.preventDefault();
          pick(o);
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "var(--fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: { padding: "10px 12px", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14.5, color: "var(--label-normal)" },
        children: o.label
      },
      i
    )) })
  ] });
}

// components/forms/Checkbox.jsx
import React58 from "react";
import { jsx as jsx57, jsxs as jsxs41 } from "react/jsx-runtime";
function Checkbox({
  label,
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  id,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = checked !== void 0;
  const [internal, setInternal] = React58.useState(!!defaultChecked);
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ jsxs41(
    "label",
    {
      htmlFor: id,
      onClick: toggle,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        letterSpacing: 0,
        color: "var(--bw-ink)"
      },
      children: [
        /* @__PURE__ */ jsx57(
          "span",
          {
            role: "checkbox",
            "aria-checked": on,
            "aria-label": ariaLabel ?? (typeof label === "string" ? label : "\uCCB4\uD06C\uBC15\uC2A4"),
            id,
            tabIndex: 0,
            onKeyDown: (e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                toggle();
              }
            },
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: 18,
              height: 18,
              flexShrink: 0,
              boxSizing: "border-box",
              background: on ? "var(--lk-accent-ink)" : "var(--bw-white)",
              border: `1.5px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
              borderRadius: "var(--radius-5)",
              transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)"
            },
            ...rest,
            children: on && /* @__PURE__ */ jsx57("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx57("path", { d: "M20 6 9 17l-5-5" }) })
          }
        ),
        label && /* @__PURE__ */ jsx57("span", { children: label })
      ]
    }
  );
}

// components/forms/CheckboxGroup.jsx
import React59 from "react";
import { jsx as jsx58, jsxs as jsxs42 } from "react/jsx-runtime";
function CheckboxGroup({ options = [], value, defaultValue = [], onChange, direction = "column", style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React59.useState(defaultValue);
  const val = isControlled ? value : internal;
  const toggle = (v) => {
    const arr = Array.isArray(val) ? val : [];
    const next = arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  return /* @__PURE__ */ jsx58("div", { role: "group", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? 20 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = Array.isArray(val) && val.includes(o.value);
    return /* @__PURE__ */ jsxs42("label", { style: { display: "inline-flex", alignItems: "flex-start", gap: 10, cursor: o.disabled ? "not-allowed" : "pointer", opacity: o.disabled ? 0.5 : 1, fontFamily: "var(--font-sans)" }, children: [
      /* @__PURE__ */ jsx58("input", { type: "checkbox", checked: on, disabled: o.disabled, onChange: () => toggle(o.value), style: { position: "absolute", opacity: 0, width: 0, height: 0 } }),
      /* @__PURE__ */ jsx58("span", { style: { marginTop: 1, flexShrink: 0, width: 20, height: 20, borderRadius: "var(--radius-sm)", border: `1px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, background: on ? "var(--lk-accent-ink)" : "var(--bw-white)", display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)" }, children: on && /* @__PURE__ */ jsx58("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx58("path", { d: "M20 6 9 17l-5-5" }) }) }),
      /* @__PURE__ */ jsxs42("span", { children: [
        /* @__PURE__ */ jsx58("span", { style: { fontSize: 15, fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--label-normal)" }, children: o.label }),
        o.description != null && /* @__PURE__ */ jsx58("span", { style: { display: "block", marginTop: 2, fontSize: 13, color: "var(--label-alternative)" }, children: o.description })
      ] })
    ] }, o.value);
  }) });
}

// components/forms/ColorSwatch.jsx
import React60 from "react";
import { jsx as jsx59 } from "react/jsx-runtime";
function ColorSwatch({ colors = [], value, defaultValue, onChange, size = 28, shape = "rounded", style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React60.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (c) => {
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const radius = shape === "circle" ? "50%" : "var(--radius-md)";
  return /* @__PURE__ */ jsx59("div", { style: { display: "inline-flex", gap: 10, flexWrap: "wrap", ...style }, ...rest, children: colors.map((c) => {
    const on = c === val;
    return /* @__PURE__ */ jsx59(
      "button",
      {
        type: "button",
        "aria-label": c,
        onClick: () => pick(c),
        style: { width: size, height: size, borderRadius: radius, background: c, cursor: "pointer", padding: 0, border: "2px solid var(--bw-white)", boxShadow: on ? "0 0 0 2px var(--lk-accent-ink)" : "inset 0 0 0 1px rgba(14,19,41,0.12)", transition: "box-shadow var(--dur-fast) var(--ease-out)" }
      },
      c
    );
  }) });
}

// components/forms/Combobox.jsx
import React61 from "react";
import { jsx as jsx60, jsxs as jsxs43 } from "react/jsx-runtime";
function Combobox({ options = [], value, defaultValue = [], onChange, placeholder = "\uC120\uD0DD", size = "md", style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React61.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React61.useState(false);
  const ref = React61.useRef(null);
  React61.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const toggle = (v) => {
    const next = sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const labelFor = (v) => {
    const o = norm.find((x) => x.value === v);
    return o ? o.label : v;
  };
  const h = size === "sm" ? 40 : 50;
  return /* @__PURE__ */ jsxs43("div", { ref, style: { position: "relative", ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs43("button", { type: "button", onClick: () => setOpen((o) => !o), style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, width: "100%", minHeight: h, padding: "6px 12px", boxSizing: "border-box", background: "var(--bw-white)", border: `1px solid ${open ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, borderRadius: "var(--radius-input)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 15, color: sel.length ? "var(--label-normal)" : "var(--label-assistive)" }, children: [
      /* @__PURE__ */ jsx60("span", { style: { display: "flex", flexWrap: "wrap", gap: 6, alignItems: "center" }, children: sel.length ? sel.map((v) => /* @__PURE__ */ jsx60("span", { style: { display: "inline-flex", height: 24, alignItems: "center", padding: "0 9px", background: "var(--lk-accent-tint-2)", color: "var(--lk-accent-ink)", borderRadius: "var(--radius-pill)", fontSize: 13, fontWeight: "var(--fw-semibold)" }, children: labelFor(v) }, v)) : placeholder }),
      /* @__PURE__ */ jsx60("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-alternative)", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 }, children: /* @__PURE__ */ jsx60("path", { d: "m6 9 6 6 6-6" }) })
    ] }),
    open && /* @__PURE__ */ jsx60("div", { role: "listbox", style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: "auto", background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }, children: norm.map((o) => {
      const on = sel.includes(o.value);
      return /* @__PURE__ */ jsxs43(
        "div",
        {
          role: "option",
          "aria-selected": on,
          onClick: () => toggle(o.value),
          onMouseEnter: (e) => {
            e.currentTarget.style.background = "var(--fill-normal)";
          },
          onMouseLeave: (e) => {
            e.currentTarget.style.background = "transparent";
          },
          style: { display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14.5, color: "var(--label-normal)" },
          children: [
            /* @__PURE__ */ jsx60("span", { style: { width: 18, height: 18, borderRadius: "var(--radius-sm)", border: `1px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, background: on ? "var(--lk-accent-ink)" : "transparent", display: "inline-flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }, children: on && /* @__PURE__ */ jsx60("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "#fff", strokeWidth: "3.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx60("path", { d: "M20 6 9 17l-5-5" }) }) }),
            o.label
          ]
        },
        o.value
      );
    }) })
  ] });
}

// components/forms/DatePicker.jsx
import React62 from "react";
import { jsx as jsx61, jsxs as jsxs44 } from "react/jsx-runtime";
function DatePicker({ value, defaultValue, onChange, placeholder = "\uB0A0\uC9DC \uC120\uD0DD", size = "md", style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React62.useState(defaultValue || null);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React62.useState(false);
  const ref = React62.useRef(null);
  React62.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const fmt = (d) => {
    if (!d) return "";
    const dt = d instanceof Date ? d : new Date(d);
    return `${dt.getFullYear()}. ${String(dt.getMonth() + 1).padStart(2, "0")}. ${String(dt.getDate()).padStart(2, "0")}`;
  };
  const h = size === "sm" ? 40 : 50;
  const pick = (d) => {
    if (!isControlled) setInternal(d);
    onChange && onChange(d);
    setOpen(false);
  };
  return /* @__PURE__ */ jsxs44("div", { ref, style: { position: "relative", display: "inline-block", ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs44(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => !o),
        style: { display: "inline-flex", alignItems: "center", gap: 10, height: h, padding: "0 14px", minWidth: 200, background: "var(--bw-white)", border: `1px solid ${open ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, borderRadius: "var(--radius-input)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 15, color: sel ? "var(--label-normal)" : "var(--label-assistive)" },
        children: [
          /* @__PURE__ */ jsxs44("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-alternative)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx61("rect", { x: "3", y: "4.5", width: "18", height: "17", rx: "2.5" }),
            /* @__PURE__ */ jsx61("path", { d: "M3 9.5h18M8 2.5v4M16 2.5v4" })
          ] }),
          /* @__PURE__ */ jsx61("span", { style: { flex: 1, textAlign: "left" }, children: sel ? fmt(sel) : placeholder })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx61("div", { style: { position: "absolute", top: "calc(100% + 8px)", left: 0, zIndex: 40 }, children: /* @__PURE__ */ jsx61(Calendar, { value: sel || void 0, onChange: pick }) })
  ] });
}

// components/forms/FileUpload.jsx
import React63 from "react";
import { jsx as jsx62, jsxs as jsxs45 } from "react/jsx-runtime";
function FileUpload({ onFiles, accept, multiple = false, hint = "\uD074\uB9AD\uD558\uAC70\uB098 \uD30C\uC77C\uC744 \uB04C\uC5B4\uB2E4 \uB193\uC73C\uC138\uC694", disabled = false, style, ...rest }) {
  const inputRef = React63.useRef(null);
  const [drag, setDrag] = React63.useState(false);
  const [names, setNames] = React63.useState([]);
  const handle = (files) => {
    const arr = Array.from(files || []);
    setNames(arr.map((f) => f.name));
    onFiles && onFiles(arr);
  };
  return /* @__PURE__ */ jsxs45(
    "div",
    {
      onClick: () => {
        if (!disabled && inputRef.current) inputRef.current.click();
      },
      onDragOver: (e) => {
        e.preventDefault();
        if (!disabled) setDrag(true);
      },
      onDragLeave: () => setDrag(false),
      onDrop: (e) => {
        e.preventDefault();
        setDrag(false);
        if (!disabled) handle(e.dataTransfer.files);
      },
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        padding: "32px 20px",
        textAlign: "center",
        border: `1.5px dashed ${drag ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
        borderRadius: "var(--radius-xl)",
        background: drag ? "var(--lk-accent-tint)" : "var(--bw-white)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        transition: "border-color var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx62("span", { style: { display: "inline-flex", width: 44, height: 44, borderRadius: "var(--radius-lg)", background: "var(--lk-accent-tint)", color: "var(--lk-accent-ink)", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsxs45("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx62("path", { d: "M12 16V4M7 9l5-5 5 5" }),
          /* @__PURE__ */ jsx62("path", { d: "M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" })
        ] }) }),
        /* @__PURE__ */ jsx62("div", { style: { fontSize: 14, fontWeight: "var(--fw-semibold)", color: names.length ? "var(--label-normal)" : "var(--label-neutral)", wordBreak: "break-all" }, children: names.length ? names.join(", ") : hint }),
        /* @__PURE__ */ jsx62("input", { ref: inputRef, type: "file", accept, multiple, disabled, onChange: (e) => handle(e.target.files), style: { display: "none" } })
      ]
    }
  );
}

// components/forms/FormField.jsx
import React64 from "react";
import { jsx as jsx63, jsxs as jsxs46 } from "react/jsx-runtime";
function FormField({ label, required = false, helper, error, htmlFor, children, style, ...rest }) {
  return /* @__PURE__ */ jsxs46("div", { style: { display: "flex", flexDirection: "column", gap: 8, fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    label != null && /* @__PURE__ */ jsxs46("label", { htmlFor, style: { fontSize: 14, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)" }, children: [
      label,
      required && /* @__PURE__ */ jsx63("span", { style: { color: "var(--bw-red)", marginLeft: 3 }, children: "*" })
    ] }),
    children,
    (error != null || helper != null) && /* @__PURE__ */ jsx63("span", { style: { fontSize: 13, lineHeight: 1.5, color: error != null ? "var(--bw-red)" : "var(--label-alternative)" }, children: error != null ? error : helper })
  ] });
}

// components/forms/Input.jsx
import React65 from "react";
import { jsx as jsx64, jsxs as jsxs47 } from "react/jsx-runtime";
function Input({
  label,
  iconLeft,
  iconRight,
  invalid = false,
  required = false,
  id,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const inputId = id || (label ? `in-${String(label).replace(/\s+/g, "-").toLowerCase()}` : void 0);
  const [focused, setFocused] = React65.useState(false);
  const ring = invalid ? "var(--component-input-border-color-invalid)" : focused ? "var(--component-input-border-color-focus)" : "var(--component-input-border-color)";
  return /* @__PURE__ */ jsxs47("div", { style: { display: "flex", flexDirection: "column", gap: "var(--component-input-stack-gap)", ...style }, children: [
    label && /* @__PURE__ */ jsxs47("label", { htmlFor: inputId, style: { fontWeight: "var(--component-input-label-font-weight)", fontSize: "var(--component-input-label-font-size)", lineHeight: "var(--component-input-label-line-height)", letterSpacing: "var(--component-input-label-letter-spacing)", color: "var(--component-input-label-color)" }, children: [
      label,
      required && /* @__PURE__ */ jsx64("span", { style: { color: "var(--component-input-required-color)" }, children: " *" })
    ] }),
    /* @__PURE__ */ jsxs47("div", { style: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: "var(--component-input-gap)",
      height: "var(--component-input-height)",
      padding: "0 var(--component-input-padding-x)",
      background: "var(--component-input-bg)",
      border: `var(--component-input-border-width) solid ${ring}`,
      borderRadius: "var(--component-input-radius)",
      boxShadow: focused && !invalid ? "var(--component-input-focus-shadow)" : "none",
      transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)"
    }, children: [
      iconLeft && /* @__PURE__ */ jsx64("span", { style: { color: "var(--component-input-icon-color)", display: "inline-flex", flex: "0 0 auto" }, children: iconLeft }),
      /* @__PURE__ */ jsx64(
        "input",
        {
          id: inputId,
          "aria-label": ariaLabel ?? (!label && typeof rest.placeholder === "string" ? rest.placeholder : void 0),
          ...rest,
          onFocus: (e) => {
            setFocused(true);
            rest.onFocus && rest.onFocus(e);
          },
          onBlur: (e) => {
            setFocused(false);
            rest.onBlur && rest.onBlur(e);
          },
          style: { flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: "var(--component-input-font-size)", lineHeight: "var(--component-input-line-height)", letterSpacing: "var(--component-input-letter-spacing)", color: "var(--component-input-text-color)" }
        }
      ),
      iconRight && /* @__PURE__ */ jsx64("span", { style: { color: "var(--component-input-icon-color)", display: "inline-flex", flex: "0 0 auto" }, children: iconRight })
    ] })
  ] });
}

// components/forms/InputGroup.jsx
import React66 from "react";
import { jsx as jsx65, jsxs as jsxs48 } from "react/jsx-runtime";
function InputGroup({ prefix, suffix, value, defaultValue, onChange, placeholder, size = "md", disabled = false, inputProps, style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React66.useState(defaultValue || "");
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const h = size === "sm" ? 40 : 50;
  const Addon = ({ node, side }) => /* @__PURE__ */ jsx65("span", { style: { display: "inline-flex", alignItems: "center", padding: "0 12px", background: "var(--fill-normal)", color: "var(--label-alternative)", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: "var(--fw-semibold)", whiteSpace: "nowrap", [side === "left" ? "borderRight" : "borderLeft"]: "1px solid var(--bw-border)" }, children: node });
  return /* @__PURE__ */ jsxs48("div", { style: { display: "inline-flex", alignItems: "stretch", height: h, width: "100%", boxSizing: "border-box", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-input)", background: "var(--bw-white)", overflow: "hidden", opacity: disabled ? 0.5 : 1, ...style }, ...rest, children: [
    prefix != null && /* @__PURE__ */ jsx65(Addon, { node: prefix, side: "left" }),
    /* @__PURE__ */ jsx65(
      "input",
      {
        value: val,
        disabled,
        placeholder,
        "aria-label": ariaLabel ?? inputProps?.["aria-label"] ?? (typeof placeholder === "string" ? placeholder : "\uC785\uB825"),
        onChange: (e) => set(e.target.value),
        style: { flex: 1, minWidth: 0, padding: "0 14px", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--label-normal)" },
        ...inputProps
      }
    ),
    suffix != null && /* @__PURE__ */ jsx65(Addon, { node: suffix, side: "right" })
  ] });
}

// components/forms/NumberField.jsx
import React67 from "react";
import { jsx as jsx66, jsxs as jsxs49 } from "react/jsx-runtime";
function NumberField({ value, defaultValue = 0, min = -Infinity, max = Infinity, step = 1, onChange, size = "md", disabled = false, placeholder, style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React67.useState(defaultValue);
  const val = isControlled ? value : internal;
  const commit = (v) => {
    const c = Math.min(max, Math.max(min, v));
    if (!isControlled) setInternal(c);
    onChange && onChange(c);
  };
  const h = size === "sm" ? 40 : 50;
  const Arrow = ({ dir }) => {
    const off = disabled || (dir < 0 ? val <= min : val >= max);
    return /* @__PURE__ */ jsx66(
      "button",
      {
        type: "button",
        tabIndex: -1,
        "aria-label": dir < 0 ? "decrease" : "increase",
        disabled: off,
        onClick: () => commit(Number(val) + dir * step),
        style: { flex: 1, display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, border: "none", borderLeft: "1px solid var(--bw-border)", background: "transparent", cursor: off ? "not-allowed" : "pointer", color: off ? "var(--label-disable)" : "var(--label-neutral)" },
        children: /* @__PURE__ */ jsx66("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx66("path", { d: dir < 0 ? "m6 9 6 6 6-6" : "m6 15 6-6 6 6" }) })
      }
    );
  };
  return /* @__PURE__ */ jsxs49("div", { style: { display: "inline-flex", alignItems: "stretch", height: h, border: "1px solid var(--bw-border)", borderRadius: "var(--radius-input)", background: "var(--bw-white)", opacity: disabled ? 0.5 : 1, overflow: "hidden", ...style }, children: [
    /* @__PURE__ */ jsx66(
      "input",
      {
        type: "number",
        value: val,
        min: min === -Infinity ? void 0 : min,
        max: max === Infinity ? void 0 : max,
        step,
        disabled,
        placeholder,
        "aria-label": ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uC22B\uC790 \uC785\uB825"),
        onChange: (e) => commit(e.target.value === "" ? 0 : Number(e.target.value)),
        style: { width: 92, padding: "0 12px", border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-semibold)", color: "var(--label-normal)" },
        ...rest
      }
    ),
    /* @__PURE__ */ jsxs49("div", { style: { display: "flex", flexDirection: "column", width: 28 }, children: [
      /* @__PURE__ */ jsx66(Arrow, { dir: 1 }),
      /* @__PURE__ */ jsx66(Arrow, { dir: -1 })
    ] })
  ] });
}

// components/forms/PasswordInput.jsx
import React68 from "react";
import { jsx as jsx67, jsxs as jsxs50 } from "react/jsx-runtime";
function PasswordInput({ value, defaultValue, onChange, placeholder = "\uBE44\uBC00\uBC88\uD638", size = "md", disabled = false, style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React68.useState(defaultValue || "");
  const [show, setShow] = React68.useState(false);
  const [focus, setFocus] = React68.useState(false);
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const h = size === "sm" ? 40 : 50;
  return /* @__PURE__ */ jsxs50("div", { style: { display: "inline-flex", alignItems: "center", gap: 8, height: h, width: "100%", padding: "0 12px 0 14px", boxSizing: "border-box", background: "var(--bw-white)", border: `1px solid ${focus ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, borderRadius: "var(--radius-input)", boxShadow: focus ? "0 0 0 4px var(--focus-ring)" : "none", opacity: disabled ? 0.5 : 1, transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)", ...style }, children: [
    /* @__PURE__ */ jsx67(
      "input",
      {
        value: val,
        disabled,
        placeholder,
        "aria-label": ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uBE44\uBC00\uBC88\uD638"),
        type: show ? "text" : "password",
        onChange: (e) => set(e.target.value),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        style: { flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--label-normal)" },
        ...rest
      }
    ),
    /* @__PURE__ */ jsx67("button", { type: "button", "aria-label": show ? "hide" : "show", onClick: () => setShow((s) => !s), style: { display: "inline-flex", padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--label-assistive)" }, children: show ? /* @__PURE__ */ jsxs50("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx67("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" }),
      /* @__PURE__ */ jsx67("circle", { cx: "12", cy: "12", r: "3" })
    ] }) : /* @__PURE__ */ jsxs50("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx67("path", { d: "M3 3l18 18" }),
      /* @__PURE__ */ jsx67("path", { d: "M10.6 10.6a3 3 0 0 0 4.2 4.2" }),
      /* @__PURE__ */ jsx67("path", { d: "M9.4 5.2A9.6 9.6 0 0 1 12 5c6.5 0 10 7 10 7a15.9 15.9 0 0 1-3.4 4.3M6.6 6.6A15.8 15.8 0 0 0 2 12s3.5 7 10 7a9.5 9.5 0 0 0 2.6-.35" })
    ] }) })
  ] });
}

// components/forms/PinInput.jsx
import React69 from "react";
import { jsx as jsx68 } from "react/jsx-runtime";
function PinInput({ length = 6, value, defaultValue = "", onChange, onComplete, mask = false, disabled = false, size = "md", style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React69.useState(defaultValue);
  const raw = (isControlled ? value : internal) || "";
  const refs = React69.useRef([]);
  const commit = (next) => {
    const v = next.slice(0, length);
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
    if (v.length === length && onComplete) onComplete(v);
  };
  const onInput = (i, e) => {
    const c = e.target.value.slice(-1);
    const arr = raw.split("");
    arr[i] = c;
    commit(arr.join("").slice(0, length));
    if (c && refs.current[i + 1]) refs.current[i + 1].focus();
  };
  const onKey = (i, e) => {
    if (e.key === "Backspace" && !raw[i] && refs.current[i - 1]) refs.current[i - 1].focus();
  };
  const boxH = size === "sm" ? 40 : 48;
  const boxW = size === "sm" ? 36 : 44;
  return /* @__PURE__ */ jsx68("div", { style: { display: "inline-flex", gap: 8, ...style }, ...rest, children: Array.from({ length }).map((_, i) => /* @__PURE__ */ jsx68(
    "input",
    {
      ref: (el) => {
        refs.current[i] = el;
      },
      value: raw[i] || "",
      disabled,
      inputMode: "numeric",
      "aria-label": `${ariaLabel ?? "PIN"} ${i + 1}`,
      maxLength: 1,
      type: mask ? "password" : "text",
      onChange: (e) => onInput(i, e),
      onKeyDown: (e) => onKey(i, e),
      style: { width: boxW, height: boxH, textAlign: "center", border: `1px solid ${raw[i] ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, borderRadius: "var(--radius-md)", outline: "none", fontFamily: "var(--font-sans)", fontSize: 18, fontWeight: "var(--fw-bold)", color: "var(--label-normal)", background: "var(--bw-white)" }
    },
    i
  )) });
}

// components/forms/Radio.jsx
import React70 from "react";
import { jsx as jsx69, jsxs as jsxs51 } from "react/jsx-runtime";
function Radio({
  label,
  checked,
  name,
  value,
  onChange,
  disabled = false,
  id,
  ...rest
}) {
  return /* @__PURE__ */ jsxs51(
    "label",
    {
      htmlFor: id,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "12px",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        fontSize: "15px",
        letterSpacing: 0,
        color: "var(--bw-ink)"
      },
      children: [
        /* @__PURE__ */ jsx69(
          "input",
          {
            type: "radio",
            id,
            name,
            value,
            checked,
            disabled,
            onChange,
            style: { position: "absolute", opacity: 0, width: 0, height: 0 },
            ...rest
          }
        ),
        /* @__PURE__ */ jsx69("span", { "aria-hidden": "true", style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 22,
          height: 22,
          flexShrink: 0,
          background: "var(--bw-white)",
          border: `1px solid ${checked ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
          borderRadius: "var(--radius-pill)",
          transition: "border-color var(--dur-fast) var(--ease-out)"
        }, children: checked && /* @__PURE__ */ jsx69("span", { style: { width: 10, height: 10, borderRadius: "50%", background: "var(--lk-accent-ink)" } }) }),
        label && /* @__PURE__ */ jsx69("span", { children: label })
      ]
    }
  );
}

// components/forms/RadioGroup.jsx
import React71 from "react";
import { jsx as jsx70, jsxs as jsxs52 } from "react/jsx-runtime";
function RadioGroup({ options = [], value, defaultValue, onChange, name, direction = "column", style, ...rest }) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React71.useState(defaultValue);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const autoId = React71.useId();
  const gname = name || autoId;
  return /* @__PURE__ */ jsx70("div", { role: "radiogroup", style: { display: "flex", flexDirection: direction === "row" ? "row" : "column", gap: direction === "row" ? 20 : 14, flexWrap: "wrap", ...style }, ...rest, children: norm.map((o) => {
    const on = o.value === val;
    return /* @__PURE__ */ jsxs52("label", { style: { display: "inline-flex", alignItems: "flex-start", gap: 10, cursor: o.disabled ? "not-allowed" : "pointer", opacity: o.disabled ? 0.5 : 1, fontFamily: "var(--font-sans)" }, children: [
      /* @__PURE__ */ jsx70("input", { type: "radio", name: gname, checked: on, disabled: o.disabled, onChange: () => pick(o.value), style: { position: "absolute", opacity: 0, width: 0, height: 0 } }),
      /* @__PURE__ */ jsx70("span", { style: { marginTop: 1, flexShrink: 0, width: 20, height: 20, borderRadius: "50%", border: `2px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-gray-300)"}`, display: "inline-flex", alignItems: "center", justifyContent: "center", transition: "border-color var(--dur-fast) var(--ease-out)" }, children: on && /* @__PURE__ */ jsx70("span", { style: { width: 10, height: 10, borderRadius: "50%", background: "var(--lk-accent-ink)" } }) }),
      /* @__PURE__ */ jsxs52("span", { children: [
        /* @__PURE__ */ jsx70("span", { style: { fontSize: 15, fontWeight: "var(--fw-semibold)", letterSpacing: 0, color: "var(--label-normal)" }, children: o.label }),
        o.description != null && /* @__PURE__ */ jsx70("span", { style: { display: "block", marginTop: 2, fontSize: 13, color: "var(--label-alternative)" }, children: o.description })
      ] })
    ] }, o.value);
  }) });
}

// components/forms/RangeSlider.jsx
import React72 from "react";
import { jsx as jsx71, jsxs as jsxs53 } from "react/jsx-runtime";
function useRangeStyles() {
  React72.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-rangeslider-css")) return;
    const el = document.createElement("style");
    el.id = "lk-rangeslider-css";
    el.textContent = `
input.lk-rangeslider{position:absolute;top:0;left:0;width:100%;height:24px;margin:0;background:transparent;-webkit-appearance:none;appearance:none;pointer-events:none;}
input.lk-rangeslider::-webkit-slider-runnable-track{background:transparent;height:24px;}
input.lk-rangeslider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;pointer-events:auto;width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid var(--lk-accent-ink);box-shadow:0 1px 3px rgba(8,14,33,0.28);cursor:pointer;margin-top:2px;}
input.lk-rangeslider::-moz-range-track{background:transparent;height:24px;}
input.lk-rangeslider::-moz-range-thumb{pointer-events:auto;width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--lk-accent-ink);box-shadow:0 1px 3px rgba(8,14,33,0.28);cursor:pointer;}`;
    document.head.appendChild(el);
  }, []);
}
function RangeSlider({ value, defaultValue = [20, 80], min = 0, max = 100, step = 1, onChange, showValue = false, style, ...rest }) {
  useRangeStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = React72.useState(defaultValue);
  const [lo, hi] = isControlled ? value : internal;
  const set = (nlo, nhi) => {
    const a = Math.min(nlo, nhi);
    const b = Math.max(nlo, nhi);
    const next = [a, b];
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const pctLo = (lo - min) / (max - min) * 100;
  const pctHi = (hi - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxs53("div", { style: { ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs53("div", { style: { position: "relative", height: 24 }, children: [
      /* @__PURE__ */ jsx71("div", { style: { position: "absolute", top: 9, left: 0, right: 0, height: 6, borderRadius: "var(--radius-pill)", background: "var(--fill-strong)" } }),
      /* @__PURE__ */ jsx71("div", { style: { position: "absolute", top: 9, height: 6, borderRadius: "var(--radius-pill)", background: "var(--lk-accent-ink)", left: `${pctLo}%`, right: `${100 - pctHi}%` } }),
      /* @__PURE__ */ jsx71("input", { className: "lk-rangeslider", type: "range", min, max, step, value: lo, onChange: (e) => set(Number(e.target.value), hi), "aria-label": "minimum" }),
      /* @__PURE__ */ jsx71("input", { className: "lk-rangeslider", type: "range", min, max, step, value: hi, onChange: (e) => set(lo, Number(e.target.value)), "aria-label": "maximum" })
    ] }),
    showValue && /* @__PURE__ */ jsxs53("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 4, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: "var(--fw-bold)", color: "var(--label-neutral)", fontVariantNumeric: "tabular-nums" }, children: [
      /* @__PURE__ */ jsx71("span", { children: lo }),
      /* @__PURE__ */ jsx71("span", { children: hi })
    ] })
  ] });
}

// components/forms/SearchField.jsx
import React73 from "react";
import { jsx as jsx72, jsxs as jsxs54 } from "react/jsx-runtime";
function SearchField({ value, defaultValue, onChange, onSearch, placeholder = "\uAC80\uC0C9", size = "md", disabled = false, style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React73.useState(defaultValue || "");
  const [focus, setFocus] = React73.useState(false);
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const h = size === "sm" ? 40 : 50;
  return /* @__PURE__ */ jsxs54("div", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 10,
    height: h,
    width: "100%",
    padding: "0 14px",
    boxSizing: "border-box",
    background: "var(--bw-white)",
    border: `1px solid ${focus ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
    borderRadius: "var(--radius-input)",
    boxShadow: focus ? "0 0 0 4px var(--focus-ring)" : "none",
    opacity: disabled ? 0.5 : 1,
    transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)",
    ...style
  }, children: [
    /* @__PURE__ */ jsxs54("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-assistive)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 }, children: [
      /* @__PURE__ */ jsx72("circle", { cx: "11", cy: "11", r: "7" }),
      /* @__PURE__ */ jsx72("path", { d: "m21 21-4.3-4.3" })
    ] }),
    /* @__PURE__ */ jsx72(
      "input",
      {
        value: val,
        disabled,
        placeholder,
        "aria-label": ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uAC80\uC0C9"),
        onChange: (e) => set(e.target.value),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        onKeyDown: (e) => {
          if (e.key === "Enter" && onSearch) onSearch(val);
        },
        style: { flex: 1, minWidth: 0, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 15, color: "var(--label-normal)" },
        ...rest
      }
    ),
    val && /* @__PURE__ */ jsx72("button", { type: "button", "aria-label": "clear", onClick: () => set(""), style: { display: "inline-flex", padding: 2, border: "none", background: "transparent", cursor: "pointer", color: "var(--label-assistive)" }, children: /* @__PURE__ */ jsxs54("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "currentColor", stroke: "none", children: [
      /* @__PURE__ */ jsx72("circle", { cx: "12", cy: "12", r: "10" }),
      /* @__PURE__ */ jsx72("path", { d: "M15 9l-6 6M9 9l6 6", stroke: "var(--bw-white)", strokeWidth: "2", strokeLinecap: "round" })
    ] }) })
  ] });
}

// components/forms/Select.jsx
import React74 from "react";
import { jsx as jsx73, jsxs as jsxs55 } from "react/jsx-runtime";
function Select({
  label,
  options,
  value,
  defaultValue,
  placeholder = "\uC120\uD0DD",
  onChange,
  required = false,
  invalid = false,
  disabled = false,
  size = "md",
  id,
  children,
  style,
  ...rest
}) {
  const norm = React74.useMemo(() => {
    if (options && options.length) return options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
    return React74.Children.toArray(children).filter((c) => c && c.type === "option").map((c) => ({ value: c.props.value != null ? c.props.value : String(c.props.children), label: c.props.children }));
  }, [options, children]);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React74.useState(defaultValue);
  const sel = isControlled ? value : internal;
  const [open, setOpen] = React74.useState(false);
  const ref = React74.useRef(null);
  const selId = id || (label ? `sel-${String(label).replace(/\s+/g, "-").toLowerCase()}` : void 0);
  React74.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
    setOpen(false);
  };
  const curr = norm.find((x) => x.value === sel);
  const h = size === "sm" ? 40 : "var(--control-h-md)";
  const ring = invalid ? "var(--bw-red)" : open ? "var(--lk-accent-ink)" : "var(--bw-border)";
  return /* @__PURE__ */ jsxs55("div", { style: { display: "flex", flexDirection: "column", gap: "8px", ...style }, children: [
    label && /* @__PURE__ */ jsxs55("label", { htmlFor: selId, style: { fontWeight: "var(--fw-bold)", fontSize: "15px", letterSpacing: 0, color: "var(--label-normal)" }, children: [
      label,
      required && /* @__PURE__ */ jsx73("span", { style: { color: "var(--bw-red)" }, children: " *" })
    ] }),
    /* @__PURE__ */ jsxs55("div", { ref, style: { position: "relative" }, children: [
      /* @__PURE__ */ jsxs55(
        "button",
        {
          id: selId,
          type: "button",
          disabled,
          "aria-haspopup": "listbox",
          "aria-expanded": open,
          onClick: () => {
            if (!disabled) setOpen((o) => !o);
          },
          ...rest,
          style: {
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 10,
            width: "100%",
            height: h,
            padding: "0 16px 0 18px",
            boxSizing: "border-box",
            background: "var(--bw-white)",
            color: curr ? "var(--label-normal)" : "var(--label-assistive)",
            border: `1px solid ${ring}`,
            borderRadius: "var(--radius-input)",
            boxShadow: open ? "0 0 0 4px var(--focus-ring)" : "none",
            cursor: disabled ? "not-allowed" : "pointer",
            opacity: disabled ? 0.5 : 1,
            fontFamily: "var(--font-sans)",
            fontSize: "15px",
            letterSpacing: 0,
            textAlign: "left",
            transition: "var(--component-button-transition)"
          },
          children: [
            /* @__PURE__ */ jsx73("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: curr ? curr.label : placeholder }),
            /* @__PURE__ */ jsx73("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-alternative)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "var(--component-button-transition)" }, children: /* @__PURE__ */ jsx73("path", { d: "m6 9 6 6 6-6" }) })
          ]
        }
      ),
      open && /* @__PURE__ */ jsx73("div", { role: "listbox", style: { position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 40, maxHeight: 260, overflowY: "auto", background: "var(--surface-overlay)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }, children: norm.map((o) => {
        const on = o.value === sel;
        return /* @__PURE__ */ jsxs55(
          "div",
          {
            role: "option",
            "aria-selected": on,
            onClick: () => pick(o.value),
            onMouseEnter: (e) => {
              if (!on) e.currentTarget.style.background = "var(--fill-normal)";
            },
            onMouseLeave: (e) => {
              if (!on) e.currentTarget.style.background = "transparent";
            },
            style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10, padding: "9px 12px", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14.5, color: on ? "var(--lk-accent-ink)" : "var(--label-normal)", background: on ? "var(--lk-accent-tint-2)" : "transparent", fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)" },
            children: [
              /* @__PURE__ */ jsx73("span", { style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: o.label }),
              on && /* @__PURE__ */ jsx73("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 }, children: /* @__PURE__ */ jsx73("path", { d: "M20 6 9 17l-5-5" }) })
            ]
          },
          o.value
        );
      }) })
    ] })
  ] });
}

// components/forms/Slider.jsx
import React75 from "react";
import { jsx as jsx74, jsxs as jsxs56 } from "react/jsx-runtime";
function useSliderStyles() {
  React75.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-slider-css")) return;
    const el = document.createElement("style");
    el.id = "lk-slider-css";
    el.textContent = `
input.lk-slider::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:20px;height:20px;border-radius:50%;background:#fff;border:2px solid var(--lk-accent-ink);box-shadow:0 1px 3px rgba(8,14,33,0.28);cursor:pointer;margin-top:0;}
input.lk-slider::-moz-range-thumb{width:18px;height:18px;border-radius:50%;background:#fff;border:2px solid var(--lk-accent-ink);box-shadow:0 1px 3px rgba(8,14,33,0.28);cursor:pointer;}
input.lk-slider:disabled::-webkit-slider-thumb{border-color:var(--bw-gray-300);cursor:not-allowed;}`;
    document.head.appendChild(el);
  }, []);
}
function Slider({ value, defaultValue = 0, min = 0, max = 100, step = 1, onChange, disabled = false, showValue = false, style, "aria-label": ariaLabel, ...rest }) {
  useSliderStyles();
  const isControlled = value !== void 0;
  const [internal, setInternal] = React75.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const pct = (val - min) / (max - min) * 100;
  return /* @__PURE__ */ jsxs56("div", { style: { display: "flex", alignItems: "center", gap: 14, ...style }, children: [
    /* @__PURE__ */ jsx74(
      "input",
      {
        className: "lk-slider",
        type: "range",
        "aria-label": ariaLabel ?? "\uAC12 \uC870\uC808",
        min,
        max,
        step,
        value: val,
        disabled,
        onChange: (e) => set(Number(e.target.value)),
        style: {
          flex: 1,
          WebkitAppearance: "none",
          appearance: "none",
          height: 6,
          borderRadius: "var(--radius-pill)",
          outline: "none",
          cursor: disabled ? "not-allowed" : "pointer",
          background: `linear-gradient(to right, var(--lk-accent-ink) 0%, var(--lk-accent-ink) ${pct}%, var(--fill-strong) ${pct}%, var(--fill-strong) 100%)`
        },
        ...rest
      }
    ),
    showValue && /* @__PURE__ */ jsx74("span", { style: { minWidth: 36, textAlign: "right", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: "var(--fw-bold)", color: "var(--label-neutral)", fontVariantNumeric: "tabular-nums" }, children: val })
  ] });
}

// components/forms/TagInput.jsx
import React76 from "react";
import { jsx as jsx75, jsxs as jsxs57 } from "react/jsx-runtime";
function TagInput({ value, defaultValue = [], onChange, placeholder = "\uC785\uB825 \uD6C4 Enter", disabled = false, style, "aria-label": ariaLabel, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React76.useState(defaultValue);
  const tags = isControlled ? value : internal;
  const [draft, setDraft] = React76.useState("");
  const set = (next) => {
    if (!isControlled) setInternal(next);
    onChange && onChange(next);
  };
  const add = (t) => {
    const v = t.trim();
    if (v && !tags.includes(v)) set([...tags, v]);
    setDraft("");
  };
  const remove = (t) => set(tags.filter((x) => x !== t));
  return /* @__PURE__ */ jsxs57("div", { style: { display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", minHeight: 50, padding: "8px 10px", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-input)", background: "var(--bw-white)", opacity: disabled ? 0.5 : 1, ...style }, ...rest, children: [
    tags.map((t) => /* @__PURE__ */ jsxs57("span", { style: { display: "inline-flex", alignItems: "center", gap: 5, height: 28, padding: "0 6px 0 11px", background: "var(--lk-accent-tint-2)", color: "var(--lk-accent-ink)", borderRadius: "var(--radius-pill)", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: "var(--fw-semibold)" }, children: [
      t,
      /* @__PURE__ */ jsx75("button", { type: "button", "aria-label": "remove", onClick: () => remove(t), style: { display: "inline-flex", border: "none", background: "transparent", cursor: "pointer", color: "var(--lk-accent-ink)", padding: 2 }, children: /* @__PURE__ */ jsx75("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", children: /* @__PURE__ */ jsx75("path", { d: "M18 6 6 18M6 6l12 12" }) }) })
    ] }, t)),
    /* @__PURE__ */ jsx75(
      "input",
      {
        value: draft,
        disabled,
        placeholder: tags.length ? "" : placeholder,
        "aria-label": ariaLabel ?? (typeof placeholder === "string" ? placeholder : "\uD0DC\uADF8 \uC785\uB825"),
        onChange: (e) => setDraft(e.target.value),
        onKeyDown: (e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            add(draft);
          } else if (e.key === "Backspace" && !draft && tags.length) remove(tags[tags.length - 1]);
        },
        style: { flex: 1, minWidth: 90, height: 28, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--label-normal)" }
      }
    )
  ] });
}

// components/forms/Textarea.jsx
import React77 from "react";
import { jsx as jsx76, jsxs as jsxs58 } from "react/jsx-runtime";
function Textarea({
  label,
  required = false,
  invalid = false,
  rows = 5,
  id,
  style,
  ...rest
}) {
  const taId = id || (label ? `ta-${String(label).replace(/\s+/g, "-").toLowerCase()}` : void 0);
  const [focused, setFocused] = React77.useState(false);
  const ring = invalid ? "var(--bw-red)" : focused ? "var(--lk-accent-ink)" : "var(--bw-border)";
  return /* @__PURE__ */ jsxs58("div", { style: { display: "flex", flexDirection: "column", gap: "8px", ...style }, children: [
    label && /* @__PURE__ */ jsxs58("label", { htmlFor: taId, style: { fontWeight: "var(--fw-bold)", fontSize: "15px", letterSpacing: 0, color: "var(--bw-ink)" }, children: [
      label,
      required && /* @__PURE__ */ jsx76("span", { style: { color: "var(--bw-red)" }, children: " *" })
    ] }),
    /* @__PURE__ */ jsx76(
      "textarea",
      {
        id: taId,
        rows,
        ...rest,
        onFocus: (e) => {
          setFocused(true);
          rest.onFocus && rest.onFocus(e);
        },
        onBlur: (e) => {
          setFocused(false);
          rest.onBlur && rest.onBlur(e);
        },
        style: {
          width: "100%",
          resize: "vertical",
          minHeight: 120,
          padding: "14px 18px",
          background: "var(--bw-white)",
          color: "var(--bw-ink)",
          border: `1px solid ${ring}`,
          borderRadius: "var(--radius-input)",
          boxShadow: focused && !invalid ? "0 0 0 4px var(--focus-ring)" : "none",
          transition: "border-color var(--dur-base) var(--ease-out), box-shadow var(--dur-base) var(--ease-out)",
          fontFamily: "var(--font-sans)",
          fontSize: "15px",
          letterSpacing: 0,
          lineHeight: 1.6,
          outline: "none",
          boxSizing: "border-box"
        }
      }
    )
  ] });
}

// components/forms/TimePicker.jsx
import React78 from "react";
import { jsx as jsx77, jsxs as jsxs59 } from "react/jsx-runtime";
function pad(n) {
  return String(n).padStart(2, "0");
}
function TimeDropdown({ value, options, onChange, height, ariaLabel }) {
  const [open, setOpen] = React78.useState(false);
  const ref = React78.useRef(null);
  React78.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return /* @__PURE__ */ jsxs59("div", { ref, style: { position: "relative" }, children: [
    /* @__PURE__ */ jsxs59(
      "button",
      {
        type: "button",
        "aria-label": ariaLabel,
        "aria-haspopup": "listbox",
        "aria-expanded": open,
        onClick: () => setOpen((o) => !o),
        style: { display: "inline-flex", alignItems: "center", gap: 8, height, padding: "0 12px", boxSizing: "border-box", background: "var(--bw-white)", border: `1px solid ${open ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, borderRadius: "var(--radius-md)", boxShadow: open ? "0 0 0 4px var(--focus-ring)" : "none", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-semibold)", color: "var(--label-normal)", transition: "border-color var(--dur-fast) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)" },
        children: [
          pad(value),
          /* @__PURE__ */ jsx77("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-alternative)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" }, children: /* @__PURE__ */ jsx77("path", { d: "m6 9 6 6 6-6" }) })
        ]
      }
    ),
    open && /* @__PURE__ */ jsx77("div", { role: "listbox", style: { position: "absolute", top: "calc(100% + 6px)", left: 0, minWidth: "100%", zIndex: 40, maxHeight: 220, overflowY: "auto", background: "var(--surface-overlay)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-md)", padding: 6, display: "flex", flexDirection: "column", gap: 2 }, children: options.map((x) => {
      const on = x === value;
      return /* @__PURE__ */ jsx77(
        "div",
        {
          role: "option",
          "aria-selected": on,
          onClick: () => {
            onChange(x);
            setOpen(false);
          },
          onMouseEnter: (e) => {
            if (!on) e.currentTarget.style.background = "var(--fill-normal)";
          },
          onMouseLeave: (e) => {
            if (!on) e.currentTarget.style.background = "transparent";
          },
          style: { padding: "7px 12px", borderRadius: "var(--radius-sm)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14.5, textAlign: "center", color: on ? "var(--lk-accent-ink)" : "var(--label-normal)", background: on ? "var(--lk-accent-tint-2)" : "transparent", fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)" },
          children: pad(x)
        },
        x
      );
    }) })
  ] });
}
function TimePicker({ value, defaultValue = "09:00", onChange, minuteStep = 5, size = "md", style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React78.useState(defaultValue);
  const v = isControlled ? value : internal;
  const [h, m] = (v || "00:00").split(":").map(Number);
  const set = (nh, nm) => {
    const nv = `${pad(nh)}:${pad(nm)}`;
    if (!isControlled) setInternal(nv);
    onChange && onChange(nv);
  };
  const height = size === "sm" ? 40 : 50;
  const hours = Array.from({ length: 24 }, (_, i) => i);
  const mins = Array.from({ length: Math.ceil(60 / minuteStep) }, (_, i) => i * minuteStep);
  return /* @__PURE__ */ jsxs59("div", { style: { display: "inline-flex", alignItems: "center", gap: 6, ...style }, ...rest, children: [
    /* @__PURE__ */ jsx77(TimeDropdown, { value: h, options: hours, onChange: (nh) => set(nh, m), height, ariaLabel: "hour" }),
    /* @__PURE__ */ jsx77("span", { style: { fontFamily: "var(--font-sans)", fontWeight: "var(--fw-bold)", color: "var(--label-alternative)" }, children: ":" }),
    /* @__PURE__ */ jsx77(TimeDropdown, { value: m, options: mins, onChange: (nm) => set(h, nm), height, ariaLabel: "minute" })
  ] });
}

// components/icon/Icon.jsx
import React79 from "react";
var ICON_NAMES = ["arrow-left", "arrow-right", "arrow-up-right", "android", "apple", "dot", "bell", "bookmark", "bookmark-fill", "bubble", "bulb", "business-bag", "calendar", "check", "chevron-down", "chevron-left", "chevron-right", "chevron-up", "circle-check", "circle-check-fill", "circle-exclamation", "circle-info", "clock", "close", "company", "crown", "document", "download", "external-link", "eye", "eye-slash", "filter", "fire", "globe", "heart", "home", "home-fill", "location", "lock", "magic-wand", "mail", "minus", "more-horizontal", "more-vertical", "nav-career", "nav-menu", "nav-mypage", "nav-recruit", "nav-social", "person", "persons", "plus", "search", "send", "setting", "share", "sparkle", "star", "star-fill", "tag", "trash", "upload", "verified-check", "circle", "circle-fill", "circle-dot", "square", "square-fill", "square-check", "square-caret", "pin", "ticket", "ticket-fill", "heart-fill", "line-horizontal", "play", "triangle-exclamation", "robot", "joystick", "waypoint", "route", "zone", "layers", "lidar", "battery", "battery-charging", "gauge", "signal", "crosshair", "compass", "map", "cpu", "camera", "volume-x", "maximize", "pause", "volume-2"];
var LINE_OPEN = '<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">';
var LINE_CLOSE = "</g>";
var LINE_ICONS = { "robot": '<path d="M12 8V4H8"></path><rect width="16" height="12" x="4" y="8" rx="2"></rect><path d="M2 14h2"></path><path d="M20 14h2"></path><path d="M15 13v2"></path><path d="M9 13v2"></path>', "joystick": '<path d="M21 17a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v2a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-2Z"></path><path d="M6 15v-2"></path><path d="M12 15V9"></path><circle cx="12" cy="6" r="3"></circle>', "waypoint": '<path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0"></path><circle cx="12" cy="10" r="3"></circle>', "route": '<circle cx="6" cy="19" r="3"></circle><path d="M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15"></path><circle cx="18" cy="5" r="3"></circle>', "zone": '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>', "layers": '<path d="M12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83z"></path><path d="M2 12a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 12"></path><path d="M2 17a1 1 0 0 0 .58.91l8.6 3.91a2 2 0 0 0 1.65 0l8.58-3.9A1 1 0 0 0 22 17"></path>', "lidar": '<path d="M19.07 4.93A10 10 0 0 0 6.99 3.34"></path><path d="M4 6h.01"></path><path d="M2.29 9.62A10 10 0 1 0 21.31 8.35"></path><path d="M16.24 7.76A6 6 0 1 0 8.23 16.67"></path><path d="M12 18h.01"></path><path d="M17.99 11.66A6 6 0 0 1 15.77 16.67"></path><circle cx="12" cy="12" r="2"></circle><path d="m13.41 10.59 5.66-5.66"></path>', "battery": '<path d="M 22 14 L 22 10"></path><rect x="2" y="6" width="16" height="12" rx="2"></rect>', "battery-charging": '<path d="m11 7-3 5h4l-3 5"></path><path d="M14.856 6H16a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.935"></path><path d="M22 14v-4"></path><path d="M5.14 18H4a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h2.936"></path>', "gauge": '<path d="m12 14 4-4"></path><path d="M3.34 19a10 10 0 1 1 17.32 0"></path>', "signal": '<path d="M2 20h.01"></path><path d="M7 20v-4"></path><path d="M12 20v-8"></path><path d="M17 20V8"></path><path d="M22 4v16"></path>', "crosshair": '<circle cx="12" cy="12" r="10"></circle><line x1="22" x2="18" y1="12" y2="12"></line><line x1="6" x2="2" y1="12" y2="12"></line><line x1="12" x2="12" y1="6" y2="2"></line><line x1="12" x2="12" y1="22" y2="18"></line>', "compass": '<circle cx="12" cy="12" r="10"></circle><path d="m16.24 7.76-1.804 5.411a2 2 0 0 1-1.265 1.265L7.76 16.24l1.804-5.411a2 2 0 0 1 1.265-1.265z"></path>', "map": '<path d="M14.106 5.553a2 2 0 0 0 1.788 0l3.659-1.83A1 1 0 0 1 21 4.619v12.764a1 1 0 0 1-.553.894l-4.553 2.277a2 2 0 0 1-1.788 0l-4.212-2.106a2 2 0 0 0-1.788 0l-3.659 1.83A1 1 0 0 1 3 19.381V6.618a1 1 0 0 1 .553-.894l4.553-2.277a2 2 0 0 1 1.788 0z"></path><path d="M15 5.764v15"></path><path d="M9 3.236v15"></path>', "cpu": '<path d="M12 20v2"></path><path d="M12 2v2"></path><path d="M17 20v2"></path><path d="M17 2v2"></path><path d="M2 12h2"></path><path d="M2 17h2"></path><path d="M2 7h2"></path><path d="M20 12h2"></path><path d="M20 17h2"></path><path d="M20 7h2"></path><path d="M7 20v2"></path><path d="M7 2v2"></path><rect x="4" y="4" width="16" height="16" rx="2"></rect><rect x="8" y="8" width="8" height="8" rx="1"></rect>', "camera": '<path d="M13.997 4a2 2 0 0 1 1.76 1.05l.486.9A2 2 0 0 0 18.003 7H20a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h1.997a2 2 0 0 0 1.759-1.048l.489-.904A2 2 0 0 1 10.004 4z"></path><circle cx="12" cy="13" r="3"></circle>', "volume-x": '<path d="M11 5 6 9H2v6h4l5 4z"></path><path d="M22 9l-6 6"></path><path d="M16 9l6 6"></path>', "maximize": '<path d="M8 3H5a2 2 0 0 0-2 2v3"></path><path d="M21 8V5a2 2 0 0 0-2-2h-3"></path><path d="M3 16v3a2 2 0 0 0 2 2h3"></path><path d="M16 21h3a2 2 0 0 0 2-2v-3"></path>', "pause": '<rect x="14" y="4" width="4" height="16" rx="1"></rect><rect x="6" y="4" width="4" height="16" rx="1"></rect>', "volume-2": '<path d="M11 5 6 9H2v6h4l5 4z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path>' };
var FILL_ICONS = { "heart-fill": '<path d="M 10.421 3.018 L 11.906 1.531 C 13.944 -0.51 17.274 -0.51 19.312 1.531 C 21.352 3.573 21.352 6.914 19.314 8.955 L 11.88 16.466 L 11.878 16.468 C 11.488 16.858 10.964 17.06 10.421 17.052 C 9.877 17.06 9.353 16.858 8.961 16.466 L 1.529 8.957 C -0.51 6.914 -0.51 3.574 1.529 1.531 C 3.568 -0.51 6.897 -0.51 8.936 1.531 L 10.421 3.018 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.579 3.474)"/>', "line-horizontal": '<path d="M 0 0.9 C 0 0.403 0.403 0 0.9 0 L 12.9 0 C 13.397 0 13.8 0.403 13.8 0.9 C 13.8 1.397 13.397 1.8 12.9 1.8 L 0.9 1.8 C 0.403 1.8 0 1.397 0 0.9 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 0 0) matrix(1 0 0 1 5.100 11.100)"/>', "play": '<path d="M 6.222 1.138 C 7.098 -0.379 9.289 -0.379 10.165 1.138 L 16.079 11.381 C 16.955 12.899 15.86 14.796 14.107 14.796 L 2.28 14.796 C 0.527 14.796 -0.568 12.899 0.308 11.381 L 6.222 1.138 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(0 1 -1 0 19.796 4)"/>', "triangle-exclamation": '<path d="M 12.302 0.92 C 11.448 -0.36 9.5 -0.304 8.741 1.088 L 0.269 16.235 L 0.195 16.385 C -0.421 17.751 0.487 19.54 2.043 19.54 L 20.044 19.54 L 20.172 19.531 C 20.635 19.468 20.991 19.072 20.991 18.592 C 20.991 18.069 20.567 17.645 20.044 17.645 L 2.043 17.645 L 2.013 17.631 C 1.937 17.57 1.837 17.317 1.927 17.153 L 10.399 2.004 L 10.439 1.952 C 10.529 1.864 10.677 1.881 10.739 1.995 L 18.222 15.683 L 18.292 15.791 C 18.568 16.167 19.087 16.29 19.508 16.059 C 19.967 15.808 20.136 15.233 19.885 14.774 L 12.402 1.087 L 12.302 0.92 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.430 1.934)"/><path d="M 10.57 6.276 C 11.049 6.276 11.446 6.633 11.509 7.095 L 11.517 7.224 L 11.517 11.961 C 11.517 12.484 11.093 12.908 10.57 12.908 C 10.09 12.908 9.694 12.552 9.631 12.089 L 9.622 11.961 L 9.622 7.224 C 9.622 6.701 10.047 6.276 10.57 6.276 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.430 1.934)"/><path d="M 9.307 15.119 C 9.307 14.42 9.873 13.855 10.57 13.855 C 11.267 13.855 11.833 14.42 11.833 15.119 C 11.833 15.817 11.267 16.382 10.57 16.382 C 9.873 16.382 9.307 15.817 9.307 15.119 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.430 1.934)"/>', "circle": '<path d="M 9.9 1.8 C 5.426 1.8 1.8 5.426 1.8 9.9 C 1.8 14.374 5.426 18 9.9 18 C 14.373 18 18 14.374 18 9.9 C 18 5.426 14.373 1.8 9.9 1.8 Z M 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.368 0 19.8 4.432 19.8 9.9 C 19.8 15.368 15.368 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100)"/>', "circle-fill": '<path d="M 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.368 0 19.8 4.432 19.8 9.9 C 19.8 15.368 15.368 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100)"/>', "circle-dot": '<path d="M 6 9.9 C 6 7.746 7.746 6 9.9 6 C 12.054 6 13.8 7.746 13.8 9.9 C 13.8 12.054 12.054 13.8 9.9 13.8 C 7.746 13.8 6 12.054 6 9.9 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 2.100 2.100)"/><path d="M 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.368 0 19.8 4.432 19.8 9.9 C 19.8 15.368 15.368 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 Z M 9.9 1.8 C 5.426 1.8 1.8 5.426 1.8 9.9 C 1.8 14.374 5.426 18 9.9 18 C 14.374 18 18 14.374 18 9.9 C 18 5.426 14.374 1.8 9.9 1.8 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.100 2.100)"/>', "square": '<path d="M 5.662 0 L 13.138 0 C 13.946 0 14.607 0 15.144 0.044 C 15.7 0.089 16.202 0.186 16.67 0.425 C 17.404 0.799 18.001 1.396 18.375 2.129 C 18.614 2.598 18.711 3.1 18.756 3.656 C 18.8 4.193 18.8 4.854 18.8 5.662 L 18.8 13.138 C 18.8 13.946 18.8 14.607 18.756 15.144 C 18.711 15.7 18.614 16.202 18.375 16.671 C 18.001 17.404 17.404 18.001 16.67 18.375 C 16.202 18.614 15.7 18.711 15.144 18.756 C 14.607 18.8 13.946 18.8 13.138 18.8 L 5.662 18.8 C 4.854 18.8 4.193 18.8 3.656 18.756 C 3.1 18.711 2.598 18.614 2.129 18.375 C 1.396 18.001 0.799 17.404 0.425 16.671 C 0.186 16.202 0.089 15.7 0.044 15.144 C 0 14.607 0 13.946 0 13.138 L 0 5.662 C 0 4.854 0 4.193 0.044 3.656 C 0.089 3.1 0.186 2.598 0.425 2.129 C 0.799 1.396 1.396 0.799 2.129 0.425 C 2.598 0.186 3.1 0.089 3.656 0.044 C 4.193 0 4.854 0 5.662 0 Z M 3.803 1.838 C 3.358 1.874 3.119 1.941 2.947 2.029 C 2.551 2.23 2.23 2.551 2.029 2.947 C 1.941 3.119 1.874 3.358 1.838 3.803 C 1.801 4.258 1.8 4.845 1.8 5.7 L 1.8 13.1 C 1.8 13.955 1.801 14.542 1.838 14.997 C 1.874 15.442 1.941 15.681 2.029 15.853 C 2.23 16.249 2.551 16.57 2.947 16.771 C 3.119 16.859 3.358 16.926 3.803 16.962 C 4.258 16.999 4.845 17 5.7 17 L 13.1 17 C 13.955 17 14.542 16.999 14.997 16.962 C 15.442 16.926 15.68 16.859 15.853 16.771 C 16.248 16.57 16.57 16.249 16.771 15.853 C 16.859 15.681 16.926 15.442 16.962 14.997 C 16.999 14.542 17 13.955 17 13.1 L 17 5.7 C 17 4.845 16.999 4.258 16.962 3.803 C 16.926 3.358 16.859 3.119 16.771 2.947 C 16.57 2.551 16.248 2.23 15.853 2.029 C 15.68 1.941 15.442 1.874 14.997 1.838 C 14.542 1.801 13.955 1.8 13.1 1.8 L 5.7 1.8 C 4.845 1.8 4.258 1.801 3.803 1.838 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.600 2.600)"/>', "square-fill": '<path d="M 5.662 0 C 4.854 0 4.193 0 3.656 0.044 C 3.1 0.089 2.598 0.186 2.129 0.425 C 1.396 0.799 0.799 1.396 0.425 2.129 C 0.186 2.598 0.089 3.1 0.044 3.656 C 0 4.193 0 4.854 0 5.662 L 0 13.138 C 0 13.946 0 14.607 0.044 15.144 C 0.089 15.7 0.186 16.202 0.425 16.671 C 0.799 17.404 1.396 18.001 2.129 18.375 C 2.598 18.614 3.1 18.711 3.656 18.756 C 4.193 18.8 4.854 18.8 5.662 18.8 L 13.138 18.8 C 13.946 18.8 14.607 18.8 15.144 18.756 C 15.7 18.711 16.202 18.614 16.67 18.375 C 17.404 18.001 18.001 17.404 18.375 16.671 C 18.614 16.202 18.711 15.7 18.756 15.144 C 18.8 14.607 18.8 13.946 18.8 13.138 L 18.8 5.662 C 18.8 4.854 18.8 4.193 18.756 3.656 C 18.711 3.1 18.614 2.598 18.375 2.129 C 18.001 1.396 17.404 0.799 16.67 0.425 C 16.202 0.186 15.7 0.089 15.144 0.044 C 14.607 0 13.946 0 13.138 0 L 5.662 0 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 2.600 2.600)"/>', "square-check": '<path d="M 14.046 7.276 C 14.392 6.919 14.383 6.349 14.025 6.003 C 13.668 5.658 13.099 5.667 12.753 6.024 L 8.077 10.855 L 6.047 8.752 C 5.702 8.395 5.132 8.385 4.774 8.73 C 4.417 9.075 4.407 9.645 4.752 10.002 L 7.428 12.775 C 7.598 12.951 7.831 13.05 8.075 13.05 C 8.319 13.05 8.553 12.951 8.723 12.776 L 14.046 7.276 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 2.600 2.600)"/><path d="M 5.662 0 C 4.854 0 4.193 0 3.656 0.044 C 3.1 0.089 2.598 0.186 2.129 0.425 C 1.396 0.799 0.799 1.396 0.425 2.129 C 0.186 2.598 0.089 3.1 0.044 3.656 C 0 4.193 0 4.854 0 5.662 L 0 13.138 C 0 13.946 0 14.607 0.044 15.144 C 0.089 15.7 0.186 16.202 0.425 16.671 C 0.799 17.404 1.396 18.001 2.129 18.375 C 2.598 18.614 3.1 18.711 3.656 18.756 C 4.193 18.8 4.854 18.8 5.662 18.8 L 13.138 18.8 C 13.946 18.8 14.607 18.8 15.144 18.756 C 15.7 18.711 16.202 18.614 16.671 18.375 C 17.404 18.001 18.001 17.404 18.375 16.671 C 18.614 16.202 18.711 15.7 18.756 15.144 C 18.8 14.607 18.8 13.946 18.8 13.138 L 18.8 5.662 C 18.8 4.854 18.8 4.193 18.756 3.656 C 18.711 3.1 18.614 2.598 18.375 2.129 C 18.001 1.396 17.404 0.799 16.671 0.425 C 16.202 0.186 15.7 0.089 15.144 0.044 C 14.607 0 13.946 0 13.138 0 L 5.662 0 Z M 2.947 2.029 C 3.119 1.941 3.358 1.874 3.803 1.838 C 4.258 1.801 4.845 1.8 5.7 1.8 L 13.1 1.8 C 13.955 1.8 14.542 1.801 14.997 1.838 C 15.442 1.874 15.681 1.941 15.853 2.029 C 16.249 2.23 16.57 2.551 16.771 2.947 C 16.859 3.119 16.926 3.358 16.962 3.803 C 16.999 4.258 17 4.845 17 5.7 L 17 13.1 C 17 13.955 16.999 14.542 16.962 14.997 C 16.926 15.442 16.859 15.681 16.771 15.853 C 16.57 16.249 16.249 16.57 15.853 16.771 C 15.681 16.859 15.442 16.926 14.997 16.962 C 14.542 16.999 13.955 17 13.1 17 L 5.7 17 C 4.845 17 4.258 16.999 3.803 16.962 C 3.358 16.926 3.119 16.859 2.947 16.771 C 2.551 16.57 2.23 16.249 2.029 15.853 C 1.941 15.681 1.874 15.442 1.838 14.997 C 1.801 14.542 1.8 13.955 1.8 13.1 L 1.8 5.7 C 1.8 4.845 1.801 4.258 1.838 3.803 C 1.874 3.358 1.941 3.119 2.029 2.947 C 2.23 2.551 2.551 2.23 2.947 2.029 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.600 2.600)"/>', "square-caret": '<path d="M 9.751 11.486 C 10.009 11.389 10.222 11.122 10.649 10.588 L 11.32 9.749 C 11.986 8.917 12.319 8.501 12.319 8.151 C 12.32 7.846 12.181 7.558 11.943 7.368 C 11.669 7.15 11.137 7.15 10.071 7.15 L 8.729 7.15 C 7.663 7.15 7.13 7.15 6.857 7.368 C 6.619 7.558 6.48 7.846 6.48 8.151 C 6.481 8.501 6.814 8.917 7.479 9.749 L 8.15 10.588 C 8.578 11.122 8.791 11.389 9.049 11.486 C 9.275 11.57 9.524 11.57 9.751 11.486 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 2.600 2.600)"/><path d="M 5.662 0 C 4.854 0 4.193 0 3.656 0.044 C 3.1 0.089 2.598 0.186 2.129 0.425 C 1.396 0.799 0.799 1.396 0.425 2.129 C 0.186 2.598 0.089 3.1 0.044 3.656 C 0 4.193 0 4.854 0 5.662 L 0 13.138 C 0 13.946 0 14.607 0.044 15.144 C 0.089 15.7 0.186 16.202 0.425 16.671 C 0.799 17.404 1.396 18.001 2.129 18.375 C 2.598 18.614 3.1 18.711 3.656 18.756 C 4.193 18.8 4.854 18.8 5.662 18.8 L 13.138 18.8 C 13.946 18.8 14.607 18.8 15.144 18.756 C 15.7 18.711 16.202 18.614 16.671 18.375 C 17.404 18.001 18.001 17.404 18.375 16.671 C 18.614 16.202 18.711 15.7 18.756 15.144 C 18.8 14.607 18.8 13.946 18.8 13.138 L 18.8 5.662 C 18.8 4.854 18.8 4.193 18.756 3.656 C 18.711 3.1 18.614 2.598 18.375 2.129 C 18.001 1.396 17.404 0.799 16.671 0.425 C 16.202 0.186 15.7 0.089 15.144 0.044 C 14.607 0 13.946 0 13.138 0 L 5.662 0 Z M 2.947 2.029 C 3.119 1.941 3.358 1.874 3.803 1.838 C 4.258 1.801 4.845 1.8 5.7 1.8 L 13.1 1.8 C 13.955 1.8 14.542 1.801 14.997 1.838 C 15.442 1.874 15.681 1.941 15.853 2.029 C 16.249 2.23 16.57 2.551 16.771 2.947 C 16.859 3.119 16.926 3.358 16.962 3.803 C 16.999 4.258 17 4.845 17 5.7 L 17 13.1 C 17 13.955 16.999 14.542 16.962 14.997 C 16.926 15.442 16.859 15.681 16.771 15.853 C 16.57 16.249 16.249 16.57 15.853 16.771 C 15.681 16.859 15.442 16.926 14.997 16.962 C 14.542 16.999 13.955 17 13.1 17 L 5.7 17 C 4.845 17 4.258 16.999 3.803 16.962 C 3.358 16.926 3.119 16.859 2.947 16.771 C 2.551 16.57 2.23 16.249 2.029 15.853 C 1.941 15.681 1.874 15.442 1.838 14.997 C 1.801 14.542 1.8 13.955 1.8 13.1 L 1.8 5.7 C 1.8 4.845 1.801 4.258 1.838 3.803 C 1.874 3.358 1.941 3.119 2.029 2.947 C 2.23 2.551 2.551 2.23 2.947 2.029 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 2.600 2.600)"/>', "pin": '<path d="M 13.196 0.186 C 12.684 -0.197 11.922 0.033 11.726 0.669 L 10.532 4.548 L 8.362 6.718 L 3.254 7.92 L 3.124 7.961 C 2.503 8.201 2.309 9.021 2.801 9.513 L 6.081 12.791 L 0.277 18.594 L 0.186 18.7 C -0.089 19.071 -0.059 19.597 0.277 19.934 C 0.647 20.303 1.247 20.303 1.617 19.934 L 7.421 14.13 L 10.699 17.407 L 10.799 17.495 C 11.351 17.915 12.184 17.608 12.303 16.893 L 12.619 14.998 L 12.631 14.87 C 12.645 14.404 12.313 13.987 11.84 13.908 L 11.712 13.896 C 11.245 13.881 10.829 14.214 10.75 14.687 L 10.737 14.766 L 5.344 9.374 L 9.059 8.502 L 9.185 8.463 C 9.307 8.415 9.419 8.343 9.512 8.249 L 12.038 5.723 L 12.138 5.606 C 12.198 5.523 12.244 5.43 12.274 5.332 L 13.079 2.712 L 17.584 7.13 L 14.887 7.935 L 14.777 7.975 C 14.67 8.022 14.572 8.089 14.488 8.173 L 11.962 10.699 L 11.87 10.805 C 11.595 11.176 11.625 11.702 11.962 12.039 L 12.068 12.131 C 12.439 12.406 12.965 12.375 13.302 12.039 L 15.658 9.681 L 19.667 8.487 L 19.792 8.441 C 20.383 8.174 20.543 7.377 20.06 6.903 L 13.295 0.271 L 13.196 0.186 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.895 1.894)"/>', "ticket": '<path d="M 9.804 5.562 C 10.156 5.21 10.726 5.21 11.077 5.562 L 11.961 6.446 C 12.312 6.797 12.312 7.367 11.961 7.718 C 11.609 8.07 11.04 8.07 10.688 7.718 L 9.804 6.835 C 9.453 6.483 9.453 5.913 9.804 5.562 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.559 1.558)"/><path d="M 13.163 8.921 C 13.515 8.569 14.084 8.569 14.436 8.921 L 15.32 9.804 C 15.671 10.156 15.671 10.726 15.32 11.077 C 14.968 11.429 14.398 11.429 14.047 11.077 L 13.163 10.193 C 12.812 9.842 12.812 9.272 13.163 8.921 Z" fill="currentColor" fill-rule="nonzero" transform="matrix(1 0 0 1 1.559 1.558)"/><path d="M 2.388 8.028 C 1.817 8.599 1.35 9.067 1.001 9.477 C 0.64 9.903 0.353 10.326 0.191 10.827 C -0.064 11.61 -0.064 12.454 0.191 13.237 C 0.459 14.062 1.093 14.731 1.928 15.574 C 2.206 15.854 2.634 15.921 2.984 15.739 C 3.588 15.424 4.349 15.522 4.855 16.027 C 5.36 16.532 5.458 17.294 5.143 17.898 C 4.96 18.248 5.027 18.676 5.308 18.953 C 6.151 19.788 6.82 20.423 7.645 20.691 C 8.428 20.945 9.272 20.945 10.055 20.691 C 10.555 20.528 10.979 20.241 11.404 19.88 C 11.815 19.532 12.282 19.064 12.854 18.493 L 18.493 12.854 C 19.064 12.282 19.532 11.815 19.88 11.404 C 20.241 10.979 20.528 10.555 20.691 10.055 C 20.945 9.272 20.945 8.428 20.691 7.645 C 20.423 6.82 19.788 6.151 18.953 5.308 C 18.676 5.027 18.248 4.96 17.898 5.143 C 17.294 5.458 16.532 5.36 16.027 4.855 C 15.521 4.349 15.424 3.588 15.739 2.984 C 15.921 2.634 15.854 2.206 15.574 1.928 C 14.731 1.093 14.062 0.459 13.237 0.191 C 12.454 -0.064 11.61 -0.064 10.827 0.191 C 10.326 0.353 9.903 0.64 9.477 1.001 C 9.067 1.35 8.599 1.817 8.028 2.388 L 2.388 8.028 Z M 2.029 11.078 C 2.163 10.814 2.424 10.537 3.264 9.698 L 9.698 3.264 C 10.537 2.424 10.814 2.164 11.078 2.029 C 11.677 1.724 12.386 1.724 12.985 2.029 C 13.189 2.133 13.403 2.314 13.888 2.79 C 13.562 3.937 13.849 5.223 14.754 6.127 C 15.658 7.032 16.944 7.319 18.091 6.993 C 18.567 7.478 18.749 7.692 18.853 7.896 C 19.158 8.495 19.158 9.204 18.853 9.803 C 18.718 10.067 18.457 10.344 17.618 11.183 L 11.183 17.618 C 10.344 18.457 10.067 18.718 9.803 18.853 C 9.204 19.158 8.495 19.158 7.896 18.853 C 7.692 18.749 7.478 18.567 6.993 18.091 C 7.319 16.944 7.032 15.658 6.127 14.754 C 5.223 13.85 3.937 13.562 2.79 13.888 C 2.314 13.403 2.133 13.189 2.029 12.985 C 1.724 12.386 1.724 11.677 2.029 11.078 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.559 1.558)"/>', "ticket-fill": '<path d="M 2.388 8.028 L 8.028 2.388 C 8.599 1.817 9.067 1.35 9.477 1.001 C 9.903 0.64 10.326 0.353 10.827 0.191 C 11.61 -0.064 12.454 -0.064 13.237 0.191 C 14.062 0.459 14.731 1.093 15.574 1.928 C 15.854 2.206 15.921 2.634 15.739 2.984 C 15.424 3.588 15.521 4.349 16.027 4.855 C 16.532 5.36 17.294 5.458 17.898 5.143 C 18.248 4.96 18.676 5.027 18.953 5.308 C 19.788 6.151 20.423 6.82 20.691 7.645 C 20.945 8.428 20.945 9.272 20.691 10.055 C 20.528 10.555 20.241 10.979 19.88 11.404 C 19.532 11.815 19.064 12.282 18.493 12.854 L 12.854 18.493 C 12.282 19.064 11.815 19.532 11.404 19.88 C 10.979 20.241 10.555 20.528 10.055 20.691 C 9.272 20.945 8.428 20.945 7.645 20.691 C 6.82 20.423 6.151 19.788 5.308 18.953 C 5.027 18.676 4.96 18.248 5.143 17.898 C 5.458 17.294 5.36 16.532 4.855 16.027 C 4.349 15.522 3.588 15.424 2.984 15.739 C 2.634 15.921 2.206 15.854 1.928 15.574 C 1.093 14.731 0.459 14.062 0.191 13.237 C -0.064 12.454 -0.064 11.61 0.191 10.827 C 0.353 10.326 0.64 9.903 1.001 9.477 C 1.35 9.067 1.817 8.599 2.388 8.028 Z M 9.452 5.21 C 9.804 4.858 10.373 4.858 10.725 5.21 L 11.786 6.27 C 12.137 6.622 12.137 7.192 11.786 7.543 C 11.434 7.895 10.864 7.895 10.513 7.543 L 9.452 6.482 C 9.101 6.131 9.101 5.561 9.452 5.21 Z M 13.34 9.098 C 13.692 8.746 14.261 8.746 14.613 9.098 L 15.674 10.158 C 16.025 10.51 16.025 11.08 15.674 11.431 C 15.322 11.783 14.752 11.783 14.401 11.431 L 13.34 10.37 C 12.989 10.019 12.989 9.449 13.34 9.098 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1.559 1.558)"/>', "android": '<path d="M 0 12.628 C 0.15 10.845 0.696 9.203 1.637 7.703 C 2.579 6.203 3.833 5.011 5.4 4.128 L 3.55 0.928 C 3.45 0.778 3.425 0.62 3.475 0.453 C 3.525 0.286 3.633 0.161 3.8 0.078 C 3.933 -0.005 4.083 -0.022 4.25 0.028 C 4.417 0.078 4.55 0.178 4.65 0.328 L 6.5 3.528 C 7.933 2.928 9.433 2.628 11 2.628 C 12.567 2.628 14.067 2.928 15.5 3.528 L 17.35 0.328 C 17.45 0.178 17.583 0.078 17.75 0.028 C 17.917 -0.022 18.067 -0.005 18.2 0.078 C 18.367 0.161 18.475 0.286 18.525 0.453 C 18.575 0.62 18.55 0.778 18.45 0.928 L 16.6 4.128 C 18.167 5.011 19.421 6.203 20.362 7.703 C 21.304 9.203 21.85 10.845 22 12.628 L 0 12.628 Z M 6 9.878 C 6.35 9.878 6.646 9.757 6.887 9.516 C 7.129 9.274 7.25 8.978 7.25 8.628 C 7.25 8.278 7.129 7.982 6.887 7.741 C 6.646 7.499 6.35 7.378 6 7.378 C 5.65 7.378 5.354 7.499 5.112 7.741 C 4.871 7.982 4.75 8.278 4.75 8.628 C 4.75 8.978 4.871 9.274 5.112 9.516 C 5.354 9.757 5.65 9.878 6 9.878 Z M 16 9.878 C 16.35 9.878 16.646 9.757 16.887 9.516 C 17.129 9.274 17.25 8.978 17.25 8.628 C 17.25 8.278 17.129 7.982 16.887 7.741 C 16.646 7.499 16.35 7.378 16 7.378 C 15.65 7.378 15.354 7.499 15.112 7.741 C 14.871 7.982 14.75 8.278 14.75 8.628 C 14.75 8.978 14.871 9.274 15.112 9.516 C 15.354 9.757 15.65 9.878 16 9.878 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 1 5.372)"/>', "apple": '<path d="M 5.381 21.346 C 6.662 21.346 7.224 20.458 8.819 20.458 C 10.414 20.458 10.796 21.312 12.212 21.312 C 13.627 21.312 14.537 19.986 15.425 18.683 C 16.414 17.189 16.818 15.728 16.852 15.661 C 16.762 15.639 14.088 14.504 14.088 11.347 C 14.088 8.606 16.2 7.37 16.313 7.28 C 14.919 5.213 12.796 5.168 12.223 5.168 C 10.662 5.168 9.381 6.145 8.572 6.145 C 7.707 6.145 6.561 5.224 5.202 5.224 C 2.618 5.224 0 7.426 0 11.572 C 0 14.144 0.977 16.874 2.168 18.638 C 3.191 20.132 4.089 21.357 5.381 21.357 L 5.381 21.346 Z M 8.673 4.921 C 9.606 4.921 10.785 4.269 11.482 3.404 C 12.111 2.618 12.571 1.517 12.571 0.416 C 12.571 0.27 12.56 0.112 12.526 0 C 11.482 0.045 10.235 0.719 9.482 1.629 C 8.887 2.326 8.347 3.404 8.347 4.516 C 8.347 4.674 8.37 4.842 8.392 4.898 C 8.46 4.91 8.561 4.921 8.673 4.921 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 3.574 0.602)"/>', "dot": '<path d="M 12 6 C 12 9.312 9.312 12 6 12 C 2.688 12 0 9.312 0 6 C 0 2.688 2.688 0 6 0 C 9.312 0 12 2.688 12 6 Z" fill="currentColor" fill-rule="evenodd" transform="matrix(1 0 0 1 6 6)"/>', "arrow-left": '<g transform="rotate(180 12 12)"><path transform="translate(2.73 4.23)" d="M 18.536 8.536 C 18.888 8.185 18.888 7.615 18.536 7.264 L 11.536 0.264 C 11.185 -0.088 10.615 -0.088 10.264 0.264 C 9.912 0.615 9.912 1.185 10.264 1.536 L 15.727 7 L 0.9 7 C 0.403 7 0 7.403 0 7.9 C 0 8.397 0.403 8.8 0.9 8.8 L 15.727 8.8 L 10.264 14.264 C 9.912 14.615 9.912 15.185 10.264 15.536 C 10.615 15.888 11.185 15.888 11.536 15.536 L 18.536 8.536 Z" fill-rule="evenodd"></path></g>', "arrow-right": '<path transform="translate(2.73 4.23)" d="M 18.536 8.536 C 18.888 8.185 18.888 7.615 18.536 7.264 L 11.536 0.264 C 11.185 -0.088 10.615 -0.088 10.264 0.264 C 9.912 0.615 9.912 1.185 10.264 1.536 L 15.727 7 L 0.9 7 C 0.403 7 0 7.403 0 7.9 C 0 8.397 0.403 8.8 0.9 8.8 L 15.727 8.8 L 10.264 14.264 C 9.912 14.615 9.912 15.185 10.264 15.536 C 10.615 15.888 11.185 15.888 11.536 15.536 L 18.536 8.536 Z" fill-rule="evenodd"></path>', "arrow-up-right": '<path transform="translate(5.94 6.07)" d="M 12.124 0.9 C 12.124 0.403 11.721 0 11.224 0 L 1.574 0 C 1.077 0 0.674 0.403 0.674 0.9 C 0.674 1.397 1.077 1.8 1.574 1.8 L 9.051 1.8 L 0.264 10.587 C -0.088 10.939 -0.088 11.509 0.264 11.86 C 0.615 12.212 1.185 12.212 1.536 11.86 L 10.324 3.073 L 10.324 10.549 C 10.324 11.047 10.727 11.449 11.224 11.449 C 11.721 11.449 12.124 11.047 12.124 10.549 L 12.124 0.9 Z" fill-rule="evenodd"></path>', "bell": '<g transform="translate(2.838 2.100)"><path d="M 9.163 0 C 6.938 0 5.108 0.788 3.851 2.274 C 2.611 3.74 2.013 5.783 2.013 8.15 L 2.013 8.9 C 2.013 11.365 1.33 12.825 0.357 13.768 C -0.025 14.138 -0.065 14.65 0.072 15.026 C 0.21 15.409 0.591 15.8 1.162 15.8 L 17.163 15.8 C 17.735 15.8 18.115 15.409 18.254 15.026 C 18.39 14.65 18.351 14.138 17.969 13.768 C 16.996 12.825 16.313 11.365 16.313 8.9 L 16.313 8.15 C 16.313 5.783 15.715 3.74 14.475 2.274 C 13.217 0.788 11.388 0 9.163 0 Z M 3.813 8.15 C 3.813 6.065 4.34 4.483 5.225 3.437 C 6.092 2.411 7.388 1.8 9.163 1.8 C 10.938 1.8 12.233 2.411 13.101 3.437 C 13.986 4.483 14.513 6.065 14.513 8.15 L 14.513 8.9 C 14.513 11.063 14.981 12.727 15.832 14 L 2.494 14 C 3.345 12.727 3.813 11.063 3.813 8.9 L 3.813 8.15 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 7.163 18 C 6.666 18 6.263 18.403 6.263 18.9 C 6.263 19.397 6.666 19.8 7.163 19.8 L 11.163 19.8 C 11.66 19.8 12.063 19.397 12.063 18.9 C 12.063 18.403 11.66 18 11.163 18 L 7.163 18 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "bookmark-fill": '<g transform="translate(4.100 2.100)"><path d="M 4.065 0 C 3.535 0 3.084 0 2.713 0.03 C 2.324 0.062 1.945 0.132 1.583 0.316 C 1.038 0.594 0.594 1.038 0.316 1.583 C 0.132 1.945 0.062 2.324 0.03 2.713 C 0 3.084 0 3.535 0 4.065 L 0 18.9 C 0 19.225 0.175 19.525 0.459 19.684 C 0.742 19.844 1.089 19.838 1.367 19.669 L 7.9 15.703 L 14.433 19.669 C 14.711 19.838 15.058 19.844 15.341 19.684 C 15.625 19.525 15.8 19.225 15.8 18.9 L 15.8 4.065 C 15.8 3.535 15.8 3.084 15.77 2.713 C 15.738 2.324 15.668 1.945 15.484 1.583 C 15.206 1.038 14.762 0.594 14.217 0.316 C 13.855 0.132 13.476 0.062 13.087 0.03 C 12.716 0 12.265 0 11.735 0 L 4.065 0 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "bookmark": '<g transform="translate(4.100 2.100)"><path d="M 4.065 0 L 11.735 0 C 12.265 0 12.716 0 13.087 0.03 C 13.476 0.062 13.855 0.132 14.217 0.316 C 14.762 0.594 15.206 1.038 15.484 1.583 C 15.668 1.945 15.738 2.324 15.77 2.713 C 15.8 3.084 15.8 3.535 15.8 4.065 L 15.8 18.9 C 15.8 19.225 15.625 19.525 15.341 19.684 C 15.058 19.844 14.711 19.838 14.433 19.669 L 7.9 15.703 L 1.367 19.669 C 1.089 19.838 0.742 19.844 0.459 19.684 C 0.175 19.525 0 19.225 0 18.9 L 0 4.065 C 0 3.535 0 3.084 0.03 2.713 C 0.062 2.324 0.132 1.945 0.316 1.583 C 0.594 1.038 1.038 0.594 1.583 0.316 C 1.945 0.132 2.324 0.062 2.713 0.03 C 3.084 0 3.535 0 4.065 0 Z M 3.7 1.8 C 2.885 1.8 2.692 1.811 2.56 1.854 C 2.225 1.963 1.963 2.225 1.854 2.56 C 1.811 2.692 1.8 2.886 1.8 3.7 L 1.8 17.301 L 7.433 13.881 C 7.72 13.707 8.08 13.707 8.367 13.881 L 14 17.301 L 14 3.7 C 14 2.886 13.989 2.692 13.946 2.56 C 13.837 2.225 13.575 1.963 13.24 1.854 C 13.108 1.811 12.915 1.8 12.1 1.8 L 3.7 1.8 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "bubble": '<g transform="translate(2.350 2.350)"><path d="M 9.65 1.8 C 5.315 1.8 1.8 5.315 1.8 9.65 C 1.8 13.985 5.315 17.5 9.65 17.5 C 11.011 17.5 12.289 17.154 13.403 16.547 C 13.607 16.435 13.847 16.407 14.071 16.468 L 16.185 17.045 C 16.645 17.17 16.93 17.247 17.139 17.284 C 17.213 17.297 17.261 17.302 17.287 17.303 C 17.293 17.298 17.298 17.293 17.303 17.287 C 17.302 17.261 17.297 17.214 17.284 17.139 C 17.247 16.93 17.17 16.645 17.045 16.185 L 16.468 14.071 C 16.407 13.847 16.435 13.607 16.546 13.403 C 17.154 12.289 17.5 11.011 17.5 9.65 C 17.5 5.315 13.985 1.8 9.65 1.8 Z M 0 9.65 C 0 4.32 4.32 0 9.65 0 C 14.979 0 19.3 4.32 19.3 9.65 C 19.3 11.188 18.939 12.645 18.297 13.937 L 18.792 15.75 C 18.904 16.16 19.003 16.526 19.057 16.826 C 19.11 17.131 19.147 17.517 19 17.903 C 18.807 18.408 18.408 18.807 17.902 19 C 17.517 19.147 17.131 19.11 16.826 19.057 C 16.526 19.004 16.16 18.904 15.75 18.792 L 13.937 18.298 C 12.645 18.939 11.188 19.3 9.65 19.3 C 4.32 19.3 0 14.98 0 9.65 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "bulb": '<g transform="translate(4.600 1.600)"><path d="M 7.4 0 C 3.313 0 0 3.313 0 7.4 C 0 10.161 1.512 12.567 3.75 13.838 L 3.75 14.033 C 3.75 14.425 3.75 14.771 3.773 15.058 C 3.798 15.364 3.854 15.681 4.012 15.99 C 4.242 16.441 4.609 16.808 5.06 17.038 C 5.369 17.196 5.686 17.252 5.992 17.277 C 6.279 17.3 6.625 17.3 7.017 17.3 L 7.783 17.3 C 8.175 17.3 8.521 17.3 8.808 17.277 C 9.114 17.252 9.431 17.196 9.74 17.038 C 10.191 16.808 10.558 16.441 10.788 15.99 C 10.946 15.681 11.002 15.364 11.027 15.058 C 11.05 14.771 11.05 14.425 11.05 14.033 L 11.05 13.838 C 13.288 12.567 14.8 10.161 14.8 7.4 C 14.8 3.313 11.487 0 7.4 0 Z M 1.8 7.4 C 1.8 4.307 4.307 1.8 7.4 1.8 C 10.493 1.8 13 4.307 13 7.4 C 13 9.644 11.679 11.582 9.769 12.476 C 9.452 12.624 9.25 12.942 9.25 13.291 L 9.25 14.3 C 9.25 14.928 9.239 15.029 9.221 15.085 C 9.161 15.268 9.018 15.411 8.835 15.47 C 8.779 15.489 8.678 15.5 8.05 15.5 L 6.75 15.5 C 6.122 15.5 6.021 15.489 5.965 15.47 C 5.782 15.411 5.639 15.268 5.579 15.085 C 5.561 15.029 5.55 14.928 5.55 14.3 L 5.55 13.291 C 5.55 12.942 5.348 12.624 5.031 12.476 C 3.121 11.582 1.8 9.644 1.8 7.4 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 5.15 19 C 4.653 19 4.25 19.403 4.25 19.9 C 4.25 20.397 4.653 20.8 5.15 20.8 L 9.65 20.8 C 10.147 20.8 10.55 20.397 10.55 19.9 C 10.55 19.403 10.147 19 9.65 19 L 5.15 19 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "business-bag": '<g transform="translate(2.100 2.600)"><path d="M 6.9 8 C 6.403 8 6 8.403 6 8.9 C 6 9.397 6.403 9.8 6.9 9.8 L 12.9 9.8 C 13.397 9.8 13.8 9.397 13.8 8.9 C 13.8 8.403 13.397 8 12.9 8 L 6.9 8 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 7.47 0 L 12.33 0 C 12.584 0 12.826 0 13.03 0.016 C 13.252 0.035 13.508 0.077 13.763 0.207 C 14.12 0.389 14.411 0.68 14.593 1.037 C 14.723 1.292 14.765 1.547 14.783 1.77 C 14.8 1.974 14.8 2.216 14.8 2.47 L 14.8 3.5 L 15.735 3.5 C 16.265 3.5 16.716 3.5 17.087 3.53 C 17.476 3.562 17.855 3.632 18.217 3.816 C 18.762 4.094 19.206 4.538 19.484 5.083 C 19.668 5.445 19.738 5.824 19.77 6.213 C 19.8 6.583 19.8 7.035 19.8 7.564 L 19.8 14.735 C 19.8 15.265 19.8 15.716 19.77 16.087 C 19.738 16.476 19.668 16.855 19.484 17.216 C 19.206 17.762 18.762 18.206 18.217 18.484 C 17.855 18.668 17.476 18.738 17.087 18.77 C 16.716 18.8 16.265 18.8 15.735 18.8 L 4.065 18.8 C 3.535 18.8 3.084 18.8 2.713 18.77 C 2.324 18.738 1.945 18.668 1.583 18.484 C 1.038 18.206 0.594 17.762 0.316 17.216 C 0.132 16.855 0.062 16.476 0.03 16.087 C 0 15.716 0 15.265 0 14.735 L 0 7.564 C 0 7.035 0 6.583 0.03 6.213 C 0.062 5.824 0.132 5.445 0.316 5.083 C 0.594 4.538 1.038 4.094 1.583 3.816 C 1.945 3.632 2.324 3.562 2.713 3.53 C 3.084 3.5 3.535 3.5 4.065 3.5 L 5 3.5 L 5 2.47 C 5 2.216 5 1.974 5.017 1.77 C 5.035 1.547 5.077 1.292 5.207 1.037 C 5.389 0.68 5.68 0.389 6.037 0.207 C 6.292 0.077 6.547 0.035 6.77 0.016 C 6.974 0 7.216 0 7.47 0 Z M 13 1.9 L 13 3.5 L 6.8 3.5 L 6.8 1.9 C 6.8 1.845 6.845 1.8 6.9 1.8 L 12.9 1.8 C 12.955 1.8 13 1.845 13 1.9 Z M 3.7 5.3 C 2.885 5.3 2.692 5.311 2.56 5.354 C 2.225 5.463 1.963 5.725 1.854 6.06 C 1.811 6.192 1.8 6.385 1.8 7.2 L 1.8 15.1 C 1.8 15.914 1.811 16.108 1.854 16.24 C 1.963 16.575 2.225 16.837 2.56 16.946 C 2.692 16.989 2.885 17 3.7 17 L 16.1 17 C 16.914 17 17.108 16.989 17.24 16.946 C 17.575 16.837 17.837 16.575 17.946 16.24 C 17.989 16.108 18 15.914 18 15.1 L 18 7.2 C 18 6.385 17.989 6.192 17.946 6.06 C 17.837 5.725 17.575 5.463 17.24 5.354 C 17.108 5.311 16.914 5.3 16.1 5.3 L 3.7 5.3 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "calendar": '<g transform="translate(2.850 1.850)"><path d="M 6.55 0.9 C 6.55 0.403 6.147 0 5.65 0 C 5.153 0 4.75 0.403 4.75 0.9 L 4.75 2 L 4.065 2 C 3.535 2 3.084 2 2.713 2.03 C 2.324 2.062 1.945 2.131 1.583 2.316 C 1.038 2.594 0.594 3.038 0.316 3.583 C 0.132 3.945 0.062 4.324 0.03 4.713 C 0 5.083 0 5.534 0 6.064 L 0 16.235 C 0 16.765 0 17.216 0.03 17.587 C 0.062 17.976 0.132 18.354 0.316 18.716 C 0.594 19.262 1.038 19.706 1.583 19.984 C 1.945 20.168 2.324 20.238 2.713 20.27 C 3.084 20.3 3.535 20.3 4.064 20.3 L 14.235 20.3 C 14.765 20.3 15.216 20.3 15.587 20.27 C 15.976 20.238 16.355 20.168 16.717 19.984 C 17.262 19.706 17.706 19.262 17.984 18.716 C 18.168 18.354 18.238 17.976 18.27 17.587 C 18.3 17.216 18.3 16.765 18.3 16.235 L 18.3 6.064 C 18.3 5.535 18.3 5.083 18.27 4.713 C 18.238 4.324 18.168 3.945 17.984 3.583 C 17.706 3.038 17.262 2.594 16.717 2.316 C 16.355 2.131 15.976 2.062 15.587 2.03 C 15.216 2 14.765 2 14.235 2 L 13.55 2 L 13.55 0.9 C 13.55 0.403 13.147 0 12.65 0 C 12.153 0 11.75 0.403 11.75 0.9 L 11.75 2 L 6.55 2 L 6.55 0.9 Z M 11.75 4.9 L 11.75 3.8 L 6.55 3.8 L 6.55 4.9 C 6.55 5.397 6.147 5.8 5.65 5.8 C 5.153 5.8 4.75 5.397 4.75 4.9 L 4.75 3.8 L 3.7 3.8 C 2.885 3.8 2.692 3.811 2.56 3.854 C 2.225 3.962 1.963 4.225 1.854 4.56 C 1.811 4.691 1.8 4.885 1.8 5.7 L 1.8 7.75 L 16.5 7.75 L 16.5 5.7 C 16.5 4.885 16.489 4.691 16.446 4.56 C 16.337 4.225 16.075 3.962 15.74 3.854 C 15.608 3.811 15.415 3.8 14.6 3.8 L 13.55 3.8 L 13.55 4.9 C 13.55 5.397 13.147 5.8 12.65 5.8 C 12.153 5.8 11.75 5.397 11.75 4.9 Z M 16.5 9.55 L 1.8 9.55 L 1.8 16.6 C 1.8 17.414 1.811 17.608 1.854 17.74 C 1.963 18.075 2.225 18.337 2.56 18.446 C 2.692 18.489 2.885 18.5 3.7 18.5 L 14.6 18.5 C 15.415 18.5 15.608 18.489 15.74 18.446 C 16.075 18.337 16.337 18.075 16.446 17.74 C 16.489 17.608 16.5 17.414 16.5 16.6 L 16.5 9.55 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "check": '<path transform="translate(4.35 6.6)" d="M 15.036 0.264 C 15.388 0.615 15.388 1.185 15.036 1.536 L 6.036 10.536 C 5.685 10.888 5.115 10.888 4.764 10.536 L 0.264 6.036 C -0.088 5.685 -0.088 5.115 0.264 4.764 C 0.615 4.412 1.185 4.412 1.536 4.764 L 5.4 8.627 L 13.764 0.264 C 14.115 -0.088 14.685 -0.088 15.036 0.264 Z"></path>', "chevron-down": '<path transform="translate(3.1 7.1)" d="M 0.264 0.264 C 0.615 -0.088 1.185 -0.088 1.536 0.264 L 8.9 7.627 L 16.264 0.264 C 16.615 -0.088 17.185 -0.088 17.536 0.264 C 17.888 0.615 17.888 1.185 17.536 1.536 L 9.536 9.536 C 9.185 9.888 8.615 9.888 8.264 9.536 L 0.264 1.536 C -0.088 1.185 -0.088 0.615 0.264 0.264 Z"></path>', "chevron-left": '<path transform="translate(7.1 3.1)" d="M 9.536 0.264 C 9.888 0.615 9.888 1.185 9.536 1.536 L 2.173 8.9 L 9.536 16.264 C 9.888 16.615 9.888 17.185 9.536 17.536 C 9.185 17.888 8.615 17.888 8.264 17.536 L 0.264 9.536 C -0.088 9.185 -0.088 8.615 0.264 8.264 L 8.264 0.264 C 8.615 -0.088 9.185 -0.088 9.536 0.264 Z"></path>', "chevron-right": '<path transform="translate(7.6 3.1)" d="M 0.264 0.264 C -0.088 0.615 -0.088 1.185 0.264 1.536 L 7.627 8.9 L 0.264 16.264 C -0.088 16.615 -0.088 17.185 0.264 17.536 C 0.615 17.888 1.185 17.888 1.536 17.536 L 9.536 9.536 C 9.888 9.185 9.888 8.615 9.536 8.264 L 1.536 0.264 C 1.185 -0.088 0.615 -0.088 0.264 0.264 Z"></path>', "chevron-up": '<path transform="translate(3.1 7.1)" d="M 0.264 9.536 C 0.615 9.888 1.185 9.888 1.536 9.536 L 8.9 2.173 L 16.264 9.536 C 16.615 9.888 17.185 9.888 17.536 9.536 C 17.888 9.185 17.888 8.615 17.536 8.264 L 9.536 0.264 C 9.185 -0.088 8.615 -0.088 8.264 0.264 L 0.264 8.264 C -0.088 8.615 -0.088 9.185 0.264 9.536 Z"></path>', "circle-check-fill": '<g transform="translate(2.100 2.100)"><path d="M 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.367 0 19.8 4.432 19.8 9.9 C 19.8 15.368 15.367 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 Z M 14.547 7.776 C 14.892 7.419 14.883 6.849 14.526 6.503 C 14.169 6.158 13.599 6.167 13.253 6.524 L 8.577 11.355 L 6.547 9.252 C 6.202 8.894 5.633 8.884 5.275 9.23 C 4.917 9.575 4.907 10.145 5.252 10.502 L 7.929 13.275 C 8.098 13.451 8.332 13.55 8.576 13.55 C 8.82 13.55 9.053 13.451 9.223 13.276 L 14.547 7.776 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "circle-check": '<g transform="translate(2.100 2.100)"><path d="M 14.547 7.776 C 14.892 7.419 14.883 6.849 14.526 6.503 C 14.169 6.158 13.599 6.167 13.253 6.524 L 8.577 11.355 L 6.548 9.252 C 6.202 8.895 5.633 8.885 5.275 9.23 C 4.917 9.575 4.907 10.145 5.252 10.502 L 7.929 13.275 C 8.098 13.451 8.332 13.55 8.576 13.55 C 8.82 13.55 9.053 13.451 9.223 13.276 L 14.547 7.776 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 9.9 0 C 4.432 0 0 4.432 0 9.9 C 0 15.368 4.432 19.8 9.9 19.8 C 15.368 19.8 19.8 15.368 19.8 9.9 C 19.8 4.432 15.368 0 9.9 0 Z M 1.8 9.9 C 1.8 5.426 5.426 1.8 9.9 1.8 C 14.373 1.8 18 5.426 18 9.9 C 18 14.374 14.373 18 9.9 18 C 5.426 18 1.8 14.374 1.8 9.9 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "circle-exclamation": '<g transform="translate(2.100 2.100)"><path d="M 10.9 13.9 C 10.9 14.452 10.452 14.9 9.9 14.9 C 9.348 14.9 8.9 14.452 8.9 13.9 C 8.9 13.348 9.348 12.9 9.9 12.9 C 10.452 12.9 10.9 13.348 10.9 13.9 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 10.8 5.9 C 10.8 5.403 10.397 5 9.9 5 C 9.403 5 9 5.403 9 5.9 L 9 10.4 C 9 10.897 9.403 11.3 9.9 11.3 C 10.397 11.3 10.8 10.897 10.8 10.4 L 10.8 5.9 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.368 0 19.8 4.432 19.8 9.9 C 19.8 15.368 15.368 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 Z M 9.9 1.8 C 5.426 1.8 1.8 5.426 1.8 9.9 C 1.8 14.374 5.426 18 9.9 18 C 14.373 18 18 14.374 18 9.9 C 18 5.426 14.373 1.8 9.9 1.8 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "circle-info": '<g transform="translate(2.100 2.100)"><path d="M 10.9 5.9 C 10.9 6.452 10.452 6.9 9.9 6.9 C 9.348 6.9 8.9 6.452 8.9 5.9 C 8.9 5.348 9.348 4.9 9.9 4.9 C 10.452 4.9 10.9 5.348 10.9 5.9 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 10.8 9.4 C 10.8 8.903 10.397 8.5 9.9 8.5 C 9.403 8.5 9 8.903 9 9.4 L 9 13.9 C 9 14.397 9.403 14.8 9.9 14.8 C 10.397 14.8 10.8 14.397 10.8 13.9 L 10.8 9.4 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 0 9.9 C 0 4.432 4.432 0 9.9 0 C 15.368 0 19.8 4.432 19.8 9.9 C 19.8 15.368 15.368 19.8 9.9 19.8 C 4.432 19.8 0 15.368 0 9.9 Z M 9.9 1.8 C 5.426 1.8 1.8 5.426 1.8 9.9 C 1.8 14.374 5.426 18 9.9 18 C 14.373 18 18 14.374 18 9.9 C 18 5.426 14.373 1.8 9.9 1.8 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "clock": '<g transform="translate(2.100 2.100)"><path d="M 9.4 4.5 C 9.897 4.5 10.3 4.903 10.3 5.4 L 10.3 10.027 L 12.511 12.238 C 12.862 12.59 12.862 13.159 12.511 13.511 C 12.159 13.862 11.59 13.862 11.238 13.511 L 8.763 11.036 C 8.584 10.856 8.496 10.62 8.5 10.385 L 8.5 5.4 C 8.5 4.903 8.903 4.5 9.4 4.5 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 9.9 0 C 4.432 0 0 4.432 0 9.9 C 0 15.368 4.432 19.8 9.9 19.8 C 15.368 19.8 19.8 15.368 19.8 9.9 C 19.8 4.432 15.368 0 9.9 0 Z M 1.8 9.9 C 1.8 5.426 5.426 1.8 9.9 1.8 C 14.373 1.8 18 5.426 18 9.9 C 18 14.374 14.373 18 9.9 18 C 5.426 18 1.8 14.374 1.8 9.9 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "close": '<g transform="translate(4.600 4.600)"><path d="M 0.264 0.264 C 0.615 -0.088 1.185 -0.088 1.536 0.264 L 7.4 6.127 L 13.264 0.264 C 13.615 -0.088 14.185 -0.088 14.536 0.264 C 14.888 0.615 14.888 1.185 14.536 1.536 L 8.673 7.4 L 14.536 13.264 C 14.888 13.615 14.888 14.185 14.536 14.536 C 14.185 14.888 13.615 14.888 13.264 14.536 L 7.4 8.673 L 1.536 14.536 C 1.185 14.888 0.615 14.888 0.264 14.536 C -0.088 14.185 -0.088 13.615 0.264 13.264 L 6.127 7.4 L 0.264 1.536 C -0.088 1.185 -0.088 0.615 0.264 0.264 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "company": '<g transform="translate(2.600 2.100)"><path d="M 3.5 8.9 C 3.5 8.403 3.903 8 4.4 8 L 8.4 8 C 8.897 8 9.3 8.403 9.3 8.9 C 9.3 9.397 8.897 9.8 8.4 9.8 L 4.4 9.8 C 3.903 9.8 3.5 9.397 3.5 8.9 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 3.5 4.9 C 3.5 4.403 3.903 4 4.4 4 L 8.4 4 C 8.897 4 9.3 4.403 9.3 4.9 C 9.3 5.397 8.897 5.8 8.4 5.8 L 4.4 5.8 C 3.903 5.8 3.5 5.397 3.5 4.9 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 3.267 0 C 2.875 0 2.529 0 2.242 0.023 C 1.936 0.048 1.619 0.104 1.31 0.262 C 0.859 0.492 0.492 0.859 0.262 1.31 C 0.104 1.619 0.048 1.936 0.023 2.242 C 0 2.529 0 2.875 0 3.267 L 0 19.8 L 6.386 19.8 C 6.391 19.8 6.395 19.8 6.4 19.8 C 6.404 19.8 6.409 19.8 6.413 19.8 L 11.879 19.8 L 11.9 19.8 L 11.921 19.8 L 18.8 19.8 L 18.8 11.267 C 18.8 10.875 18.8 10.529 18.777 10.242 C 18.752 9.936 18.696 9.619 18.538 9.31 C 18.308 8.859 17.941 8.492 17.49 8.262 C 17.181 8.104 16.864 8.048 16.558 8.023 C 16.271 8 15.925 8 15.533 8 L 12.8 8 L 12.8 3.267 C 12.8 2.875 12.8 2.529 12.777 2.242 C 12.752 1.936 12.696 1.619 12.538 1.31 C 12.308 0.859 11.941 0.492 11.49 0.262 C 11.181 0.104 10.864 0.048 10.558 0.023 C 10.271 0 9.925 0 9.533 0 L 3.267 0 Z M 7.3 18 L 11 18 L 11 3 C 11 2.372 10.989 2.271 10.971 2.215 C 10.911 2.032 10.768 1.889 10.585 1.829 C 10.529 1.811 10.428 1.8 9.8 1.8 L 3 1.8 C 2.372 1.8 2.271 1.811 2.215 1.829 C 2.032 1.889 1.889 2.032 1.829 2.215 C 1.811 2.271 1.8 2.372 1.8 3 L 1.8 18 L 5.5 18 L 5.5 14.9 C 5.5 14.403 5.903 14 6.4 14 C 6.897 14 7.3 14.403 7.3 14.9 L 7.3 18 Z M 17 18 L 12.8 18 L 12.8 9.8 L 15.8 9.8 C 16.428 9.8 16.529 9.811 16.585 9.829 C 16.768 9.889 16.911 10.032 16.971 10.215 C 16.989 10.271 17 10.372 17 11 L 17 18 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "crown": '<g transform="translate(2.600 2.850)"><path d="M 10.134 0.38 C 9.966 0.142 9.692 0 9.4 0 C 9.108 0 8.834 0.142 8.666 0.38 L 6.262 3.773 C 5.93 4.241 5.712 4.548 5.527 4.769 C 5.348 4.983 5.249 5.054 5.184 5.088 C 4.978 5.196 4.744 5.236 4.514 5.203 C 4.441 5.193 4.324 5.158 4.085 5.017 C 3.836 4.87 3.528 4.653 3.059 4.322 L 1.419 3.165 C 1.13 2.961 0.748 2.945 0.444 3.124 C 0.139 3.304 -0.033 3.645 0.005 3.997 L 1.005 13.247 C 1.055 13.704 1.44 14.05 1.9 14.05 L 16.9 14.05 C 17.36 14.05 17.745 13.704 17.795 13.247 L 18.795 3.997 C 18.833 3.645 18.661 3.304 18.356 3.124 C 18.052 2.945 17.67 2.961 17.381 3.165 L 15.741 4.322 C 15.272 4.653 14.964 4.87 14.715 5.017 C 14.476 5.158 14.359 5.193 14.286 5.203 C 14.056 5.236 13.822 5.196 13.616 5.088 C 13.551 5.054 13.452 4.983 13.273 4.769 C 13.088 4.548 12.87 4.241 12.538 3.773 L 10.134 0.38 Z M 9.4 2.457 L 11.374 5.244 C 11.729 5.746 12.023 6.163 12.394 6.439 C 13.138 6.994 14.102 7.159 14.987 6.884 C 15.429 6.747 15.846 6.453 16.348 6.097 L 16.791 5.784 L 16.092 12.25 L 2.708 12.25 L 2.009 5.784 L 2.452 6.097 C 2.954 6.453 3.371 6.747 3.813 6.884 C 4.698 7.159 5.662 6.994 6.405 6.439 C 6.777 6.163 7.071 5.746 7.426 5.244 L 9.4 2.457 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 2.4 16.5 C 1.903 16.5 1.5 16.903 1.5 17.4 C 1.5 17.897 1.903 18.3 2.4 18.3 L 16.4 18.3 C 16.897 18.3 17.3 17.897 17.3 17.4 C 17.3 16.903 16.897 16.5 16.4 16.5 L 2.4 16.5 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "document": '<g transform="translate(3.850 2.100)"><path d="M 9.429 0.053 C 9.206 -0.001 8.979 0 8.787 0 L 8.737 0 L 4.065 0 C 3.535 0 3.084 0 2.713 0.03 C 2.324 0.062 1.945 0.132 1.583 0.316 C 1.038 0.594 0.594 1.038 0.316 1.584 C 0.132 1.946 0.062 2.324 0.03 2.713 C 0 3.084 0 3.535 0 4.065 L 0 15.736 C 0 16.265 0 16.717 0.03 17.087 C 0.062 17.476 0.132 17.855 0.316 18.217 C 0.594 18.762 1.038 19.206 1.583 19.484 C 1.945 19.668 2.324 19.738 2.713 19.77 C 3.083 19.8 3.535 19.8 4.064 19.8 L 12.235 19.8 C 12.765 19.8 13.216 19.8 13.587 19.77 C 13.976 19.738 14.355 19.668 14.716 19.484 C 15.262 19.206 15.706 18.762 15.984 18.217 C 16.168 17.855 16.238 17.476 16.27 17.087 C 16.3 16.717 16.3 16.265 16.3 15.736 L 16.3 7.562 L 16.3 7.512 C 16.3 7.32 16.301 7.093 16.247 6.87 C 16.201 6.676 16.124 6.491 16.02 6.321 C 15.9 6.126 15.739 5.965 15.603 5.83 L 15.568 5.795 L 10.505 0.732 L 10.469 0.697 C 10.334 0.561 10.174 0.4 9.978 0.28 C 9.808 0.176 9.623 0.099 9.429 0.053 Z M 8.75 1.8 C 8.746 1.8 8.742 1.8 8.737 1.8 L 4.1 1.8 C 3.525 1.8 3.148 1.801 2.86 1.825 C 2.582 1.847 2.466 1.887 2.401 1.92 C 2.194 2.026 2.025 2.194 1.92 2.401 C 1.886 2.467 1.847 2.582 1.824 2.86 C 1.801 3.148 1.8 3.525 1.8 4.1 L 1.8 15.7 C 1.8 16.275 1.801 16.652 1.824 16.941 C 1.847 17.219 1.886 17.334 1.92 17.4 C 2.025 17.607 2.194 17.775 2.401 17.881 C 2.466 17.914 2.582 17.953 2.86 17.976 C 3.148 18 3.525 18 4.1 18 L 12.2 18 C 12.775 18 13.152 18 13.44 17.976 C 13.718 17.953 13.833 17.914 13.899 17.881 C 14.106 17.775 14.275 17.607 14.38 17.4 C 14.414 17.334 14.453 17.219 14.476 16.941 C 14.499 16.652 14.5 16.275 14.5 15.7 L 14.5 7.8 L 11.221 7.8 C 10.966 7.8 10.724 7.8 10.52 7.783 C 10.298 7.765 10.043 7.723 9.788 7.593 C 9.43 7.411 9.14 7.12 8.957 6.763 C 8.827 6.508 8.785 6.253 8.767 6.03 C 8.75 5.826 8.75 5.584 8.75 5.33 L 8.75 1.8 Z M 13.227 6 L 10.55 3.323 L 10.55 5.9 C 10.55 5.955 10.595 6 10.65 6 L 13.227 6 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "download": '<g transform="translate(2.850 2.725)"><path d="M 9.15 0 C 9.647 0 10.05 0.403 10.05 0.9 L 10.05 10.228 L 13.013 7.264 C 13.365 6.913 13.935 6.913 14.286 7.264 C 14.638 7.616 14.638 8.185 14.286 8.537 L 9.786 13.037 C 9.435 13.388 8.865 13.388 8.513 13.037 L 4.013 8.537 C 3.662 8.185 3.662 7.616 4.013 7.264 C 4.365 6.913 4.935 6.913 5.286 7.264 L 8.25 10.228 L 8.25 0.9 C 8.25 0.403 8.653 0 9.15 0 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 18.3 12.3 C 18.3 11.803 17.897 11.4 17.4 11.4 C 16.903 11.4 16.5 11.803 16.5 12.3 L 16.5 14.85 C 16.5 15.665 16.489 15.859 16.446 15.99 C 16.337 16.325 16.075 16.588 15.74 16.696 C 15.608 16.739 15.415 16.75 14.6 16.75 L 3.7 16.75 C 2.885 16.75 2.692 16.739 2.56 16.696 C 2.225 16.588 1.963 16.325 1.854 15.99 C 1.811 15.859 1.8 15.665 1.8 14.85 L 1.8 12.3 C 1.8 11.803 1.397 11.4 0.9 11.4 C 0.403 11.4 0 11.803 0 12.3 L 0 14.486 C 0 15.015 0 15.467 0.03 15.837 C 0.062 16.226 0.132 16.605 0.316 16.967 C 0.594 17.512 1.038 17.956 1.583 18.234 C 1.945 18.419 2.324 18.488 2.713 18.52 C 3.084 18.55 3.535 18.55 4.065 18.55 L 14.235 18.55 C 14.765 18.55 15.216 18.55 15.587 18.52 C 15.976 18.488 16.355 18.419 16.717 18.234 C 17.262 17.956 17.706 17.512 17.984 16.967 C 18.168 16.605 18.238 16.226 18.27 15.837 C 18.3 15.467 18.3 15.016 18.3 14.486 L 18.3 12.3 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "external-link": '<g transform="translate(2.850 2.850)"><path d="M 11.9 0 C 11.403 0 11 0.403 11 0.9 C 11 1.397 11.403 1.8 11.9 1.8 L 15.227 1.8 L 8.514 8.514 C 8.162 8.865 8.162 9.435 8.514 9.786 C 8.865 10.138 9.435 10.138 9.787 9.786 L 16.5 3.073 L 16.5 6.4 C 16.5 6.897 16.903 7.3 17.4 7.3 C 17.897 7.3 18.3 6.897 18.3 6.4 L 18.3 0.9 C 18.3 0.403 17.897 0 17.4 0 L 11.9 0 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 7.25 0.001 C 7.747 0.001 8.15 0.404 8.15 0.901 C 8.15 1.398 7.747 1.801 7.25 1.801 L 5.7 1.801 C 4.845 1.801 4.258 1.801 3.803 1.838 C 3.358 1.875 3.119 1.941 2.947 2.029 C 2.551 2.231 2.23 2.552 2.029 2.947 C 1.941 3.12 1.874 3.359 1.838 3.803 C 1.801 4.259 1.8 4.846 1.8 5.701 L 1.8 12.601 C 1.8 13.456 1.801 14.043 1.838 14.498 C 1.874 14.942 1.941 15.181 2.029 15.354 C 2.23 15.749 2.551 16.07 2.947 16.272 C 3.119 16.36 3.358 16.426 3.803 16.463 C 4.258 16.5 4.845 16.501 5.7 16.501 L 12.6 16.501 C 13.455 16.501 14.042 16.5 14.497 16.463 C 14.942 16.426 15.18 16.36 15.353 16.272 C 15.748 16.07 16.07 15.749 16.271 15.354 C 16.359 15.181 16.426 14.942 16.462 14.498 C 16.499 14.043 16.5 13.456 16.5 12.601 L 16.5 11.051 C 16.5 10.554 16.903 10.151 17.4 10.151 C 17.897 10.151 18.3 10.554 18.3 11.051 L 18.3 12.638 C 18.3 13.446 18.3 14.107 18.256 14.644 C 18.211 15.2 18.114 15.702 17.875 16.171 C 17.501 16.905 16.904 17.502 16.171 17.876 C 15.702 18.114 15.2 18.211 14.644 18.257 C 14.107 18.301 13.446 18.301 12.638 18.301 L 5.662 18.301 C 4.854 18.301 4.193 18.301 3.656 18.257 C 3.1 18.211 2.598 18.114 2.129 17.876 C 1.396 17.502 0.799 16.905 0.425 16.171 C 0.186 15.702 0.089 15.2 0.044 14.644 C 0 14.107 0 13.446 0 12.638 L 0 5.663 C 0 4.855 0 4.194 0.044 3.657 C 0.089 3.101 0.186 2.599 0.425 2.13 C 0.799 1.396 1.396 0.8 2.129 0.426 C 2.598 0.187 3.1 0.09 3.656 0.044 C 4.193 0.001 4.854 0.001 5.662 0.001 L 7.25 0.001 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "eye-slash": '<g transform="translate(1.787 3.600)"><path d="M 14.027 8.946 C 14.08 8.689 14.108 8.423 14.108 8.151 C 14.108 5.997 12.362 4.251 10.208 4.251 C 9.935 4.251 9.669 4.278 9.412 4.332 L 14.027 8.946 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 1.571 0.264 C 1.923 -0.088 2.493 -0.088 2.844 0.264 L 4.78 2.199 C 6.379 1.278 8.235 0.75 10.213 0.75 C 14.77 0.75 18.673 3.546 20.302 7.515 C 20.469 7.922 20.469 8.378 20.302 8.785 C 19.476 10.796 18.067 12.506 16.284 13.704 L 17.844 15.264 C 18.196 15.615 18.196 16.185 17.844 16.536 C 17.493 16.888 16.923 16.888 16.571 16.536 L 14.646 14.611 C 13.292 15.214 11.792 15.55 10.213 15.55 C 5.657 15.55 1.754 12.754 0.125 8.785 C -0.042 8.378 -0.042 7.922 0.125 7.515 C 0.812 5.842 1.903 4.377 3.277 3.242 L 1.571 1.536 C 1.22 1.185 1.22 0.615 1.571 0.264 Z M 4.557 4.522 C 3.36 5.473 2.408 6.719 1.811 8.15 C 3.182 11.438 6.428 13.75 10.213 13.75 C 11.283 13.75 12.309 13.565 13.262 13.227 L 11.763 11.728 C 11.286 11.935 10.761 12.051 10.208 12.051 C 8.054 12.051 6.308 10.304 6.308 8.151 C 6.308 7.598 6.423 7.072 6.63 6.595 L 4.557 4.522 Z M 14.982 12.402 C 16.597 11.406 17.878 9.919 18.616 8.15 C 17.244 4.862 13.999 2.55 10.213 2.55 C 8.736 2.55 7.341 2.902 6.108 3.527 L 14.982 12.402 Z M 8.109 8.074 L 10.284 10.249 C 10.259 10.25 10.233 10.251 10.208 10.251 C 9.048 10.251 8.108 9.31 8.108 8.151 C 8.108 8.125 8.108 8.099 8.109 8.074 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "eye": '<g transform="translate(1.787 4.601)"><path d="M 10.213 3.5 C 8.059 3.5 6.313 5.246 6.313 7.4 C 6.313 9.554 8.059 11.3 10.213 11.3 C 12.367 11.3 14.113 9.554 14.113 7.4 C 14.113 5.246 12.367 3.5 10.213 3.5 Z M 8.113 7.4 C 8.113 6.24 9.054 5.3 10.213 5.3 C 11.373 5.3 12.313 6.24 12.313 7.4 C 12.313 8.56 11.373 9.5 10.213 9.5 C 9.054 9.5 8.113 8.56 8.113 7.4 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 10.213 14.799 C 14.77 14.799 18.673 12.004 20.302 8.035 C 20.469 7.628 20.469 7.171 20.302 6.765 C 18.673 2.795 14.77 0 10.213 0 C 5.657 0 1.754 2.795 0.125 6.765 C -0.042 7.171 -0.042 7.628 0.125 8.035 C 1.754 12.004 5.657 14.799 10.213 14.799 Z M 1.811 7.4 C 3.182 4.111 6.428 1.8 10.213 1.8 C 13.999 1.8 17.244 4.111 18.616 7.4 C 17.244 10.688 13.999 12.999 10.213 12.999 C 6.428 12.999 3.182 10.688 1.811 7.4 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "filter": '<g transform="translate(2.662 2.568)"><path d="M 3.245 0 L 15.432 0 C 15.98 0 16.451 0 16.818 0.033 C 17.169 0.064 17.631 0.137 17.997 0.444 C 18.457 0.829 18.708 1.409 18.674 2.008 C 18.647 2.485 18.383 2.871 18.166 3.149 C 17.939 3.439 17.616 3.782 17.241 4.181 L 12.239 9.506 L 12.239 15.855 L 12.239 15.871 C 12.24 15.938 12.244 16.153 12.173 16.358 C 12.115 16.526 12.02 16.679 11.896 16.806 C 11.744 16.961 11.551 17.054 11.489 17.083 L 11.476 17.09 L 8.415 18.62 C 8.319 18.668 8.199 18.728 8.09 18.771 C 7.975 18.816 7.744 18.895 7.463 18.854 C 7.137 18.805 6.844 18.625 6.655 18.354 C 6.492 18.121 6.46 17.88 6.449 17.756 C 6.438 17.64 6.438 17.506 6.439 17.398 L 6.439 9.506 L 1.436 4.181 C 1.061 3.782 0.738 3.439 0.511 3.149 C 0.294 2.871 0.03 2.485 0.003 2.008 C -0.031 1.409 0.22 0.829 0.68 0.444 C 1.046 0.137 1.508 0.064 1.859 0.033 C 2.226 0 2.697 0 3.245 0 Z M 1.827 1.968 L 7.995 8.534 C 8.151 8.701 8.239 8.921 8.239 9.15 L 8.239 16.696 L 10.439 15.596 L 10.439 9.15 C 10.439 8.921 10.526 8.701 10.683 8.534 L 16.85 1.968 C 16.91 1.905 16.865 1.8 16.777 1.8 L 1.9 1.8 C 1.812 1.8 1.767 1.905 1.827 1.968 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "fire": '<g transform="translate(2.850 1.499)"><path d="M 5.65 13.701 C 5.65 15.601 7.2 17.101 9.15 17.101 C 11.1 17.101 12.65 15.601 12.65 13.701 C 12.65 11.801 11.1 10.301 9.15 8.601 C 7.2 10.301 5.65 11.801 5.65 13.701 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 11.415 0.433 C 10.656 -0.266 9.461 -0.093 8.917 0.765 L 5.961 5.421 L 5.261 4.791 C 4.638 4.23 3.638 4.202 3.01 4.864 C 1.111 6.864 0 9.476 0 12.202 C 0 14.732 0.939 16.946 2.583 18.526 C 4.224 20.103 6.517 21.002 9.15 21.002 C 14.479 21.002 18.3 17.117 18.3 12.202 C 18.3 8.039 15.641 4.322 11.415 0.433 Z M 6.91 7.284 L 10.336 1.887 C 14.409 5.664 16.5 8.885 16.5 12.202 C 16.5 16.086 13.521 19.202 9.15 19.202 C 6.933 19.202 5.101 18.45 3.83 17.228 C 2.561 16.008 1.8 14.272 1.8 12.202 C 1.8 10.032 2.661 7.914 4.185 6.244 L 5.548 7.471 C 5.745 7.648 6.01 7.729 6.272 7.693 C 6.535 7.657 6.768 7.508 6.91 7.284 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "globe": '<g transform="translate(2.100 2.100)"><path d="M 9.857 1.8 C 9.886 1.8 9.914 1.8 9.943 1.8 C 10.831 3.063 11.517 4.479 11.954 6 L 7.846 6 C 8.283 4.479 8.969 3.063 9.857 1.8 Z M 12.292 2.159 C 12.958 3.353 13.476 4.642 13.818 6 L 17.001 6 C 15.998 4.178 14.314 2.783 12.292 2.159 Z M 17.725 7.8 L 14.163 7.8 C 14.253 8.487 14.3 9.188 14.3 9.9 C 14.3 10.612 14.253 11.313 14.163 12 L 17.725 12 C 17.904 11.33 18 10.626 18 9.9 C 18 9.174 17.904 8.47 17.725 7.8 Z M 17.001 13.8 L 13.818 13.8 C 13.476 15.158 12.958 16.447 12.292 17.641 C 14.314 17.017 15.998 15.622 17.001 13.8 Z M 9.943 18 C 9.914 18 9.886 18 9.857 18 C 8.969 16.737 8.283 15.321 7.846 13.8 L 11.954 13.8 C 11.517 15.321 10.831 16.737 9.943 18 Z M 7.508 17.641 C 5.486 17.017 3.802 15.622 2.799 13.8 L 5.982 13.8 C 6.324 15.158 6.842 16.447 7.508 17.641 Z M 2.075 12 L 5.637 12 C 5.547 11.313 5.5 10.612 5.5 9.9 C 5.5 9.188 5.547 8.487 5.637 7.8 L 2.075 7.8 C 1.896 8.47 1.8 9.174 1.8 9.9 C 1.8 10.626 1.896 11.33 2.075 12 Z M 2.799 6 L 5.982 6 C 6.324 4.642 6.842 3.353 7.508 2.159 C 5.486 2.783 3.802 4.178 2.799 6 Z M 9.9 0 C 4.432 0 0 4.432 0 9.9 C 0 15.368 4.432 19.8 9.9 19.8 C 15.368 19.8 19.8 15.368 19.8 9.9 C 19.8 4.432 15.368 0 9.9 0 Z M 7.455 12 L 12.345 12 C 12.447 11.315 12.5 10.614 12.5 9.9 C 12.5 9.186 12.447 8.485 12.345 7.8 L 7.455 7.8 C 7.353 8.485 7.3 9.186 7.3 9.9 C 7.3 10.614 7.353 11.315 7.455 12 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "heart": '<g transform="translate(1.500 2.678)"><path d="M 0 6.3 C 0 2.837 2.67 0 6.1 0 C 7.842 0 9.397 0.737 10.5 1.919 C 11.603 0.737 13.157 0 14.9 0 C 18.33 0 21 2.837 21 6.3 C 21 7.94 20.406 9.321 19.479 10.603 C 18.569 11.861 17.303 13.068 15.912 14.36 L 15.908 14.363 L 12.169 17.791 C 11.996 17.95 11.83 18.102 11.679 18.22 C 11.514 18.349 11.312 18.482 11.056 18.56 C 10.693 18.671 10.306 18.671 9.944 18.56 C 9.688 18.482 9.486 18.349 9.321 18.22 C 9.17 18.102 9.004 17.95 8.831 17.791 L 5.092 14.363 L 5.088 14.36 C 3.697 13.068 2.431 11.861 1.521 10.603 C 0.594 9.321 0 7.94 0 6.3 Z M 6.1 1.8 C 3.73 1.8 1.8 3.763 1.8 6.3 C 1.8 7.46 2.206 8.479 2.979 9.547 C 3.769 10.639 4.902 11.731 6.31 13.038 L 10.432 16.817 C 10.471 16.852 10.529 16.852 10.568 16.817 L 14.69 13.038 C 16.098 11.731 17.231 10.639 18.021 9.547 C 18.793 8.479 19.2 7.46 19.2 6.3 C 19.2 3.763 17.27 1.8 14.9 1.8 C 13.367 1.8 12.032 2.613 11.269 3.869 C 11.106 4.137 10.814 4.301 10.5 4.301 C 10.186 4.301 9.894 4.137 9.731 3.869 C 8.968 2.613 7.633 1.8 6.1 1.8 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "home-fill": '<g transform="translate(2.600 2.415)"><path d="M 9.039 0.047 C 9.275 -0.016 9.525 -0.016 9.762 0.047 C 10.042 0.122 10.275 0.304 10.398 0.4 L 10.433 0.427 L 17.266 5.653 C 17.653 5.948 17.979 6.197 18.222 6.521 C 18.435 6.806 18.594 7.128 18.691 7.47 C 18.801 7.86 18.801 8.27 18.8 8.757 L 18.8 15.106 C 18.8 15.636 18.8 16.087 18.77 16.457 C 18.738 16.847 18.668 17.225 18.484 17.587 C 18.206 18.133 17.762 18.576 17.217 18.854 C 16.855 19.039 16.476 19.109 16.087 19.14 C 15.717 19.171 15.265 19.171 14.736 19.171 L 10.3 19.171 L 10.3 11.771 C 10.3 11.274 9.897 10.871 9.4 10.871 C 8.903 10.871 8.5 11.274 8.5 11.771 L 8.5 19.171 L 4.065 19.171 C 3.535 19.171 3.084 19.171 2.713 19.14 C 2.324 19.109 1.945 19.039 1.584 18.854 C 1.038 18.576 0.594 18.133 0.316 17.587 C 0.132 17.225 0.062 16.847 0.03 16.457 C 0 16.087 0 15.636 0 15.106 L 0 8.757 C 0 8.27 -0.001 7.86 0.109 7.47 C 0.206 7.128 0.365 6.806 0.578 6.521 C 0.821 6.197 1.147 5.948 1.534 5.653 L 8.367 0.427 L 8.402 0.4 C 8.525 0.304 8.758 0.122 9.039 0.047 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "home": '<g transform="translate(2.600 2.415)"><path d="M 9.762 0.047 C 9.525 -0.016 9.275 -0.016 9.039 0.047 C 8.758 0.122 8.525 0.304 8.402 0.4 L 8.367 0.427 L 1.534 5.653 C 1.147 5.948 0.821 6.197 0.578 6.521 C 0.365 6.806 0.206 7.128 0.109 7.47 C -0.001 7.86 0 8.27 0 8.757 L 0 15.106 C 0 15.636 0 16.087 0.03 16.457 C 0.062 16.847 0.132 17.225 0.316 17.587 C 0.594 18.133 1.038 18.576 1.584 18.854 C 1.945 19.039 2.324 19.109 2.713 19.14 C 3.084 19.171 3.535 19.171 4.065 19.171 L 9.39 19.171 C 9.393 19.171 9.397 19.171 9.4 19.171 C 9.404 19.171 9.407 19.171 9.411 19.171 L 14.735 19.171 C 15.265 19.171 15.717 19.171 16.087 19.14 C 16.476 19.109 16.855 19.039 17.217 18.854 C 17.762 18.576 18.206 18.133 18.484 17.587 C 18.668 17.225 18.738 16.847 18.77 16.457 C 18.8 16.087 18.8 15.636 18.8 15.106 L 18.8 8.757 C 18.801 8.27 18.801 7.86 18.691 7.47 C 18.594 7.128 18.435 6.806 18.222 6.521 C 17.979 6.197 17.653 5.948 17.266 5.653 L 10.433 0.427 L 10.398 0.4 C 10.275 0.304 10.042 0.122 9.762 0.047 Z M 10.3 17.37 L 15.1 17.37 C 15.915 17.37 16.108 17.359 16.24 17.317 C 16.575 17.208 16.837 16.945 16.946 16.61 C 16.989 16.479 17 16.285 17 15.47 L 17 8.654 C 17 8.234 16.997 8.138 16.982 8.058 C 16.944 7.858 16.853 7.672 16.717 7.522 C 16.662 7.461 16.588 7.4 16.254 7.145 L 9.4 1.903 L 2.546 7.145 C 2.212 7.4 2.138 7.461 2.084 7.522 C 1.947 7.672 1.856 7.858 1.819 8.058 C 1.804 8.138 1.8 8.234 1.8 8.654 L 1.8 15.47 C 1.8 16.285 1.811 16.479 1.854 16.61 C 1.963 16.945 2.225 17.208 2.56 17.317 C 2.692 17.359 2.886 17.37 3.7 17.37 L 8.5 17.37 L 8.5 11.771 C 8.5 11.274 8.903 10.871 9.4 10.871 C 9.897 10.871 10.3 11.274 10.3 11.771 L 10.3 17.37 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "location": '<g transform="translate(3.600 1.976)"><path d="M 12.803 16.53 C 11.83 17.555 10.86 18.393 10.134 18.974 C 9.735 19.294 9.328 19.608 8.904 19.896 C 8.604 20.099 8.194 20.098 7.894 19.895 C 7.471 19.608 7.065 19.293 6.666 18.974 C 5.94 18.393 4.97 17.555 3.997 16.53 C 2.091 14.521 0 11.613 0 8.4 C 0 3.761 3.761 0 8.4 0 C 13.039 0 16.8 3.761 16.8 8.4 C 16.8 11.613 14.709 14.521 12.803 16.53 Z M 8.4 1.8 C 4.755 1.8 1.8 4.755 1.8 8.4 C 1.8 10.881 3.459 13.348 5.303 15.291 C 6.514 16.567 7.736 17.544 8.4 18.041 C 9.064 17.544 10.286 16.567 11.497 15.291 C 13.341 13.348 15 10.881 15 8.4 C 15 4.755 12.045 1.8 8.4 1.8 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 8.4 4.75 C 6.384 4.75 4.75 6.384 4.75 8.4 C 4.75 10.416 6.384 12.05 8.4 12.05 C 10.416 12.05 12.05 10.416 12.05 8.4 C 12.05 6.384 10.416 4.75 8.4 4.75 Z M 6.55 8.4 C 6.55 7.378 7.378 6.55 8.4 6.55 C 9.422 6.55 10.25 7.378 10.25 8.4 C 10.25 9.422 9.422 10.25 8.4 10.25 C 7.378 10.25 6.55 9.422 6.55 8.4 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "lock": '<g transform="translate(3.600 2.225)"><path d="M 8.4 0 C 7.052 0 5.702 0.551 4.749 1.493 L 4.746 1.496 C 3.934 2.309 3.516 3.27 3.351 4.513 L 3.351 4.518 C 3.275 5.113 3.25 5.814 3.25 6.85 L 3.25 7.256 C 3.055 7.26 2.876 7.267 2.713 7.281 C 2.324 7.312 1.945 7.382 1.583 7.566 C 1.038 7.845 0.594 8.288 0.316 8.834 C 0.132 9.196 0.062 9.574 0.03 9.964 C 0 10.334 0 10.785 0 11.315 L 0 15.486 C 0 16.016 0 16.467 0.03 16.837 C 0.062 17.226 0.132 17.605 0.316 17.967 C 0.594 18.513 1.038 18.956 1.583 19.234 C 1.945 19.419 2.324 19.488 2.713 19.52 C 3.084 19.55 3.535 19.55 4.065 19.55 L 12.735 19.55 C 13.265 19.55 13.716 19.55 14.087 19.52 C 14.476 19.488 14.855 19.419 15.217 19.234 C 15.762 18.956 16.206 18.513 16.484 17.967 C 16.668 17.605 16.738 17.226 16.77 16.837 C 16.8 16.467 16.8 16.016 16.8 15.486 L 16.8 11.315 C 16.8 10.785 16.8 10.334 16.77 9.964 C 16.738 9.574 16.668 9.196 16.484 8.834 C 16.206 8.288 15.762 7.845 15.217 7.566 C 14.855 7.382 14.476 7.312 14.087 7.281 C 13.923 7.267 13.744 7.26 13.55 7.256 L 13.55 6.85 C 13.55 5.765 13.525 5.073 13.458 4.524 L 13.457 4.51 C 13.291 3.294 12.866 2.308 12.054 1.496 L 12.05 1.493 C 11.089 0.542 9.756 0 8.4 0 Z M 11.75 7.25 L 11.75 6.85 C 11.75 5.782 11.724 5.182 11.672 4.746 C 11.548 3.842 11.261 3.249 10.783 2.771 C 10.163 2.159 9.287 1.8 8.4 1.8 C 7.522 1.8 6.629 2.167 6.017 2.771 C 5.539 3.249 5.26 3.817 5.136 4.747 C 5.076 5.223 5.05 5.831 5.05 6.85 L 5.05 7.25 L 11.75 7.25 Z M 2.56 9.104 C 2.692 9.061 2.885 9.05 3.7 9.05 L 13.1 9.05 C 13.915 9.05 14.108 9.061 14.24 9.104 C 14.575 9.213 14.837 9.475 14.946 9.81 C 14.989 9.942 15 10.136 15 10.95 L 15 15.85 C 15 16.665 14.989 16.859 14.946 16.99 C 14.837 17.325 14.575 17.588 14.24 17.696 C 14.108 17.739 13.915 17.75 13.1 17.75 L 3.7 17.75 C 2.885 17.75 2.692 17.739 2.56 17.696 C 2.225 17.588 1.963 17.325 1.854 16.99 C 1.811 16.859 1.8 16.665 1.8 15.85 L 1.8 10.95 C 1.8 10.136 1.811 9.942 1.854 9.81 C 1.963 9.475 2.225 9.213 2.56 9.104 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "magic-wand": '<g transform="translate(2.057 2.057)"><path d="M 2.5 0.9 C 2.5 0.403 2.903 0 3.4 0 C 3.897 0 4.3 0.403 4.3 0.9 C 4.3 1.788 4.46 2.093 4.583 2.217 C 4.707 2.34 5.012 2.5 5.9 2.5 C 6.397 2.5 6.8 2.903 6.8 3.4 C 6.8 3.897 6.397 4.3 5.9 4.3 C 5.012 4.3 4.707 4.46 4.583 4.583 C 4.46 4.707 4.3 5.012 4.3 5.9 C 4.3 6.397 3.897 6.8 3.4 6.8 C 2.903 6.8 2.5 6.397 2.5 5.9 C 2.5 5.012 2.34 4.707 2.217 4.583 C 2.093 4.46 1.788 4.3 0.9 4.3 C 0.403 4.3 0 3.897 0 3.4 C 0 2.903 0.403 2.5 0.9 2.5 C 1.788 2.5 2.093 2.34 2.217 2.217 C 2.34 2.093 2.5 1.788 2.5 0.9 Z M 15.9 2 C 15.403 2 15 2.403 15 2.9 C 15 3.6 14.872 3.781 14.826 3.826 C 14.781 3.872 14.6 4 13.9 4 C 13.403 4 13 4.403 13 4.9 C 13 5.397 13.403 5.8 13.9 5.8 C 14.6 5.8 14.781 5.928 14.826 5.974 C 14.872 6.02 15 6.2 15 6.9 C 15 7.397 15.403 7.8 15.9 7.8 C 16.397 7.8 16.8 7.397 16.8 6.9 C 16.8 6.2 16.928 6.02 16.974 5.974 C 17.02 5.928 17.2 5.8 17.9 5.8 C 18.397 5.8 18.8 5.397 18.8 4.9 C 18.8 4.403 18.397 4 17.9 4 C 17.2 4 17.02 3.872 16.974 3.826 C 16.928 3.781 16.8 3.6 16.8 2.9 C 16.8 2.403 16.397 2 15.9 2 Z M 4.9 13 C 4.403 13 4 13.403 4 13.9 C 4 14.6 3.872 14.781 3.826 14.826 C 3.781 14.872 3.6 15 2.9 15 C 2.403 15 2 15.403 2 15.9 C 2 16.397 2.403 16.8 2.9 16.8 C 3.6 16.8 3.781 16.928 3.826 16.974 C 3.872 17.02 4 17.2 4 17.9 C 4 18.397 4.403 18.8 4.9 18.8 C 5.397 18.8 5.8 18.397 5.8 17.9 C 5.8 17.2 5.929 17.02 5.974 16.974 C 6.02 16.928 6.2 16.8 6.9 16.8 C 7.397 16.8 7.8 16.397 7.8 15.9 C 7.8 15.403 7.397 15 6.9 15 C 6.2 15 6.02 14.872 5.974 14.826 C 5.929 14.781 5.8 14.6 5.8 13.9 C 5.8 13.403 5.397 13 4.9 13 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 9.244 6.112 C 8.712 5.848 8.088 5.848 7.556 6.112 C 7.27 6.253 7.03 6.495 6.822 6.705 L 6.705 6.822 C 6.496 7.03 6.253 7.271 6.112 7.556 C 5.848 8.088 5.848 8.712 6.112 9.243 C 6.253 9.529 6.496 9.77 6.705 9.978 L 15.822 19.095 C 16.03 19.304 16.271 19.546 16.556 19.688 C 17.088 19.951 17.712 19.951 18.243 19.688 C 18.529 19.546 18.77 19.304 18.978 19.095 L 19.095 18.978 C 19.304 18.77 19.546 18.529 19.688 18.243 C 19.951 17.712 19.951 17.088 19.688 16.556 C 19.546 16.27 19.304 16.03 19.095 15.822 L 9.978 6.705 C 9.77 6.495 9.529 6.253 9.244 6.112 Z M 8.329 7.743 C 8.368 7.704 8.432 7.704 8.471 7.743 L 12.763 12.036 L 12.036 12.763 L 7.744 8.47 C 7.704 8.431 7.704 8.368 7.744 8.329 L 8.329 7.743 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "mail": '<g transform="translate(2.100 4.350)"><path d="M 4.065 0 C 3.535 0 3.084 0 2.713 0.03 C 2.324 0.062 1.945 0.132 1.583 0.316 C 1.038 0.594 0.594 1.038 0.316 1.583 C 0.132 1.945 0.062 2.324 0.03 2.713 C 0 3.084 0 3.535 0 4.065 L 0 11.235 C 0 11.765 0 12.216 0.03 12.587 C 0.062 12.976 0.132 13.355 0.316 13.717 C 0.594 14.262 1.038 14.706 1.583 14.984 C 1.945 15.168 2.324 15.238 2.713 15.27 C 3.084 15.3 3.535 15.3 4.065 15.3 L 15.735 15.3 C 16.265 15.3 16.716 15.3 17.087 15.27 C 17.476 15.238 17.855 15.168 18.217 14.984 C 18.762 14.706 19.206 14.262 19.484 13.717 C 19.668 13.355 19.738 12.976 19.77 12.587 C 19.8 12.216 19.8 11.765 19.8 11.235 L 19.8 4.065 C 19.8 3.535 19.8 3.084 19.77 2.713 C 19.738 2.324 19.668 1.945 19.484 1.583 C 19.206 1.038 18.762 0.594 18.217 0.316 C 17.855 0.132 17.476 0.062 17.087 0.03 C 16.716 0 16.265 0 15.735 0 L 4.065 0 Z M 2.56 1.855 C 2.692 1.812 2.885 1.801 3.7 1.801 L 16.1 1.801 C 16.915 1.801 17.108 1.812 17.24 1.855 C 17.575 1.964 17.837 2.227 17.946 2.561 C 17.977 2.658 17.992 2.788 17.997 3.171 L 11.18 7.719 C 10.48 8.186 10.314 8.28 10.161 8.317 C 9.993 8.357 9.817 8.357 9.648 8.317 C 9.495 8.28 9.329 8.186 8.629 7.719 L 1.803 3.171 C 1.808 2.788 1.823 2.658 1.854 2.561 C 1.963 2.227 2.225 1.964 2.56 1.855 Z M 1.8 5.332 L 1.8 11.601 C 1.8 12.416 1.811 12.61 1.854 12.741 C 1.963 13.076 2.225 13.339 2.56 13.447 C 2.692 13.49 2.885 13.501 3.7 13.501 L 16.1 13.501 C 16.915 13.501 17.108 13.49 17.24 13.447 C 17.575 13.339 17.837 13.076 17.946 12.741 C 17.989 12.61 18 12.416 18 11.601 L 18 5.333 L 12.073 9.287 C 11.538 9.645 11.088 9.946 10.581 10.068 C 10.137 10.174 9.674 10.174 9.229 10.068 C 8.722 9.947 8.272 9.646 7.737 9.288 L 1.8 5.332 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "minus": '<path transform="translate(3.1 11.1)" d="M 0 0.9 C 0 0.403 0.403 0 0.9 0 L 16.9 0 C 17.397 0 17.8 0.403 17.8 0.9 C 17.8 1.397 17.397 1.8 16.9 1.8 L 0.9 1.8 C 0.403 1.8 0 1.397 0 0.9 Z"></path>', "more-horizontal": '<g transform="translate(3.5 10.25)"><path d="M 1.75 3.5 C 2.716 3.5 3.5 2.717 3.5 1.75 C 3.5 0.784 2.716 0 1.75 0 C 0.783 0 0 0.784 0 1.75 C 0 2.717 0.783 3.5 1.75 3.5 Z"></path><path d="M 10.25 1.75 C 10.25 2.717 9.466 3.5 8.5 3.5 C 7.533 3.5 6.75 2.717 6.75 1.75 C 6.75 0.784 7.533 0 8.5 0 C 9.466 0 10.25 0.784 10.25 1.75 Z"></path><path d="M 17 1.75 C 17 2.717 16.216 3.5 15.25 3.5 C 14.283 3.5 13.5 2.717 13.5 1.75 C 13.5 0.784 14.283 0 15.25 0 C 16.216 0 17 0.784 17 1.75 Z"></path></g>', "more-vertical": '<g transform="translate(10.25 3.5)"><path d="M 3.5 15.25 C 3.5 14.284 2.716 13.5 1.75 13.5 C 0.783 13.5 0 14.284 0 15.25 C 0 16.216 0.783 17 1.75 17 C 2.716 17 3.5 16.216 3.5 15.25 Z"></path><path d="M 1.75 6.75 C 2.716 6.75 3.5 7.534 3.5 8.5 C 3.5 9.466 2.716 10.25 1.75 10.25 C 0.783 10.25 0 9.466 0 8.5 C 0 7.534 0.783 6.75 1.75 6.75 Z"></path><path d="M 1.75 0 C 2.716 0 3.5 0.784 3.5 1.75 C 3.5 2.716 2.716 3.5 1.75 3.5 C 0.783 3.5 0 2.716 0 1.75 C 0 0.784 0.783 0 1.75 0 Z"></path></g>', "nav-career": '<g transform="translate(3.726 2.999)"><path d="M 2.5 1.25 C 2.5 0.56 1.94 0 1.25 0 C 0.56 0 0 0.56 0 1.25 L 0 16.752 C 0 17.442 0.56 18.002 1.25 18.002 C 1.94 18.002 2.5 17.442 2.5 16.752 L 2.5 13.042 C 4.544 11.338 6.642 12.105 8.751 12.875 C 10.909 13.663 13.078 14.456 15.215 12.613 C 16.067 11.879 16.548 10.688 16.548 9.452 L 16.548 2.408 C 16.548 1.576 15.678 1.225 15.033 1.737 C 12.734 3.558 10.593 2.744 8.501 1.949 C 6.487 1.183 4.518 0.435 2.5 2.077 L 2.5 1.25 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "nav-menu": '<g transform="translate(4.000 5.000)"><path d="M 15.333 0 L 0.667 0 C 0.298 0 0 0.366 0 0.817 L 0 1.633 C 0 2.084 0.298 2.45 0.667 2.45 L 15.333 2.45 C 15.701 2.45 16 2.084 16 1.633 L 16 0.817 C 16 0.366 15.701 0 15.333 0 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 15.333 5.775 L 0.667 5.775 C 0.298 5.775 0 6.141 0 6.592 L 0 7.408 C 0 7.859 0.298 8.225 0.667 8.225 L 15.333 8.225 C 15.701 8.225 16 7.859 16 7.408 L 16 6.592 C 16 6.141 15.701 5.775 15.333 5.775 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 0.667 11.55 L 15.333 11.55 C 15.701 11.55 16 11.916 16 12.367 L 16 13.183 C 16 13.634 15.701 14 15.333 14 L 0.667 14 C 0.298 14 0 13.634 0 13.183 L 0 12.367 C 0 11.916 0.298 11.55 0.667 11.55 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "nav-mypage": '<g transform="translate(2.000 2.000)"><path d="M 20 10 C 20 15.523 15.523 20 10 20 C 4.477 20 0 15.523 0 10 C 0 4.477 4.477 0 10 0 C 15.523 0 20 4.477 20 10 Z M 10 10 C 11.841 10 13.333 8.508 13.333 6.667 C 13.333 4.826 11.841 3.333 10 3.333 C 8.159 3.333 6.667 4.826 6.667 6.667 C 6.667 8.508 8.159 10 10 10 Z M 10 11.667 C 7.275 11.667 4.867 12.979 3.346 15 C 4.867 17.021 7.279 18.333 10 18.333 C 12.721 18.333 15.133 17.021 16.654 15 C 15.133 12.979 12.721 11.667 10 11.667 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "nav-recruit": '<g transform="translate(3.000 2.550)"><path d="M 7.855 0 C 5.922 0 4.355 1.567 4.355 3.5 L 4.355 3.605 L 3.15 3.605 C 1.41 3.605 0 5.015 0 6.754 L 0 15.751 C 0 17.49 1.41 18.9 3.15 18.9 L 14.85 18.9 C 16.59 18.9 18 17.49 18 15.751 L 18 6.754 C 18 5.015 16.59 3.605 14.85 3.605 L 13.555 3.605 L 13.555 3.5 C 13.555 1.567 11.988 0 10.055 0 L 7.855 0 Z M 11.555 3.605 L 11.555 3.5 C 11.555 2.672 10.884 2 10.055 2 L 7.855 2 C 7.027 2 6.355 2.672 6.355 3.5 L 6.355 3.605 L 11.555 3.605 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "nav-social": '<g transform="translate(0.000 3.650)"><path d="M 19.113 3.49 C 19.113 5.417 17.55 6.98 15.621 6.98 C 13.693 6.98 12.13 5.417 12.13 3.49 C 12.13 1.562 13.693 0 15.621 0 C 17.55 0 19.113 1.562 19.113 3.49 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 10.641 4.863 C 10.641 6.59 9.24 7.99 7.513 7.99 C 5.785 7.99 4.385 6.59 4.385 4.863 C 4.385 3.136 5.785 1.736 7.513 1.736 C 9.24 1.736 10.641 3.136 10.641 4.863 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 8.546 9.618 C 8.574 9.594 8.602 9.571 8.625 9.553 C 8.267 9.515 7.895 9.487 7.508 9.487 C 2.77 9.487 0 12.433 0 15.225 C 0 16.109 0.591 16.695 1.471 16.695 L 6.284 16.695 C 6 16.23 5.842 15.671 5.842 15.053 C 5.842 13.047 6.824 11.065 8.542 9.613 L 8.546 9.618 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 10.51 9.939 C 11.851 9.148 13.569 8.65 15.621 8.65 L 15.621 8.654 C 20.909 8.654 24 11.935 24 15.057 C 24 16.044 23.344 16.7 22.357 16.7 L 8.886 16.7 C 7.899 16.7 7.243 16.044 7.243 15.057 C 7.243 13.149 8.402 11.181 10.51 9.939 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "person": '<g transform="translate(3.100 2.601)"><path d="M 8.9 0 C 6.194 0 4 2.194 4 4.9 C 4 7.606 6.194 9.8 8.9 9.8 C 11.606 9.8 13.8 7.606 13.8 4.9 C 13.8 2.194 11.606 0 8.9 0 Z M 5.8 4.9 C 5.8 3.188 7.188 1.8 8.9 1.8 C 10.612 1.8 12 3.188 12 4.9 C 12 6.612 10.612 8 8.9 8 C 7.188 8 5.8 6.612 5.8 4.9 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 8.9 10.998 C 6.588 10.998 4.431 11.451 2.816 12.321 C 1.203 13.189 0 14.565 0 16.398 L 0 16.726 C 0 16.913 0 17.103 0.013 17.265 C 0.028 17.446 0.064 17.67 0.18 17.898 C 0.338 18.209 0.59 18.461 0.901 18.62 C 1.129 18.736 1.353 18.771 1.534 18.786 C 1.697 18.799 1.887 18.799 2.073 18.799 L 15.727 18.799 C 15.913 18.799 16.104 18.799 16.266 18.785 C 16.447 18.771 16.671 18.735 16.899 18.619 C 17.21 18.46 17.462 18.208 17.62 17.898 C 17.736 17.669 17.772 17.445 17.787 17.264 C 17.8 17.102 17.8 16.912 17.8 16.725 L 17.8 16.398 C 17.8 14.565 16.597 13.189 14.984 12.321 C 13.369 11.451 11.212 10.998 8.9 10.998 Z M 1.8 16.398 C 1.8 15.471 2.388 14.596 3.67 13.905 C 4.951 13.215 6.794 12.798 8.9 12.798 C 11.006 12.798 12.849 13.215 14.13 13.905 C 15.412 14.596 16 15.471 16 16.398 L 15.998 16.997 L 1.802 16.998 L 1.8 16.398 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "persons": '<g transform="translate(1.100 3.600)"><path d="M 10 3.9 C 10 1.746 11.746 0 13.9 0 C 16.054 0 17.8 1.746 17.8 3.9 C 17.8 6.054 16.054 7.8 13.9 7.8 C 11.746 7.8 10 6.054 10 3.9 Z M 13.9 1.8 C 12.741 1.8 11.8 2.74 11.8 3.9 C 11.8 5.06 12.741 6 13.9 6 C 15.06 6 16 5.06 16 3.9 C 16 2.74 15.06 1.8 13.9 1.8 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 8.479 10.347 C 9.922 9.459 11.846 8.999 13.9 8.999 C 15.954 8.999 17.879 9.459 19.322 10.347 C 20.779 11.244 21.8 12.626 21.8 14.399 L 21.8 14.726 C 21.8 14.913 21.8 15.103 21.787 15.265 C 21.772 15.446 21.737 15.67 21.62 15.899 C 21.462 16.209 21.21 16.461 20.899 16.62 C 20.671 16.736 20.447 16.772 20.266 16.786 C 20.104 16.8 19.914 16.8 19.727 16.8 L 8.074 16.8 C 7.887 16.8 7.697 16.8 7.535 16.787 C 7.354 16.772 7.13 16.737 6.901 16.621 C 6.591 16.462 6.338 16.21 6.18 15.899 C 6.064 15.671 6.028 15.447 6.013 15.266 C 6 15.104 6 14.914 6 14.727 L 6 14.399 C 6 12.626 7.022 11.244 8.479 10.347 Z M 9.422 11.88 C 8.346 12.543 7.8 13.411 7.8 14.399 L 7.802 14.999 L 19.998 14.998 L 20 14.399 C 20 13.411 19.455 12.543 18.378 11.88 C 17.288 11.209 15.712 10.799 13.9 10.799 C 12.088 10.799 10.513 11.209 9.422 11.88 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 1.875 11.531 C 2.893 10.87 4.208 10.546 5.59 10.504 C 5.136 11.066 4.767 11.706 4.523 12.42 C 3.859 12.543 3.292 12.757 2.855 13.041 C 2.172 13.484 1.8 14.091 1.8 14.899 L 1.8 14.999 L 4.202 14.999 C 4.203 15.13 4.208 15.275 4.219 15.413 C 4.243 15.705 4.309 16.192 4.576 16.717 C 4.59 16.744 4.605 16.772 4.62 16.799 L 1.901 16.799 L 1.85 16.799 C 1.677 16.8 1.439 16.801 1.222 16.743 C 0.654 16.59 0.209 16.146 0.057 15.577 C -0.001 15.36 -0.001 15.123 0 14.95 L 0 14.899 C 0 13.406 0.748 12.263 1.875 11.531 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 5.4 3 C 3.799 3 2.5 4.298 2.5 5.9 C 2.5 7.502 3.799 8.8 5.4 8.8 C 7.002 8.8 8.3 7.502 8.3 5.9 C 8.3 4.298 7.002 3 5.4 3 Z M 4.3 5.9 C 4.3 5.292 4.793 4.8 5.4 4.8 C 6.008 4.8 6.5 5.292 6.5 5.9 C 6.5 6.507 6.008 7 5.4 7 C 4.793 7 4.3 6.507 4.3 5.9 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "plus": '<path transform="translate(3.1 3.1)" d="M 8.9 0 C 9.397 0 9.8 0.403 9.8 0.9 L 9.8 8 L 16.9 8 C 17.397 8 17.8 8.403 17.8 8.9 C 17.8 9.397 17.397 9.8 16.9 9.8 L 9.8 9.8 L 9.8 16.9 C 9.8 17.397 9.397 17.8 8.9 17.8 C 8.403 17.8 8 17.397 8 16.9 L 8 9.8 L 0.9 9.8 C 0.403 9.8 0 9.397 0 8.9 C 0 8.403 0.403 8 0.9 8 L 8 8 L 8 0.9 C 8 0.403 8.403 0 8.9 0 Z"></path>', "search": '<g transform="translate(2.350 2.350)"><path d="M 7.9 0 C 3.537 0 0 3.537 0 7.9 C 0 12.263 3.537 15.8 7.9 15.8 C 9.757 15.8 11.465 15.159 12.814 14.086 L 17.764 19.036 C 18.115 19.388 18.685 19.388 19.036 19.036 C 19.388 18.685 19.388 18.115 19.036 17.764 L 14.086 12.813 C 15.159 11.465 15.8 9.757 15.8 7.9 C 15.8 3.537 12.263 0 7.9 0 Z M 1.8 7.9 C 1.8 4.531 4.531 1.8 7.9 1.8 C 11.269 1.8 14 4.531 14 7.9 C 14 11.269 11.269 14 7.9 14 C 4.531 14 1.8 11.269 1.8 7.9 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "send": '<g transform="translate(2.916 2.662)"><path d="M 5.371 1.288 C 4.603 0.873 3.973 0.533 3.468 0.315 C 2.982 0.105 2.416 -0.084 1.848 0.039 C 1.096 0.2 0.467 0.712 0.157 1.416 C -0.078 1.948 -0.007 2.54 0.1 3.059 C 0.211 3.597 0.417 4.283 0.668 5.119 L 1.935 9.339 L 0.668 13.559 C 0.417 14.394 0.211 15.08 0.1 15.619 C -0.007 16.137 -0.078 16.73 0.157 17.262 C 0.467 17.965 1.096 18.477 1.848 18.639 C 2.416 18.761 2.982 18.572 3.468 18.362 C 3.973 18.145 4.603 17.804 5.371 17.389 L 16.23 11.519 C 16.624 11.306 16.972 11.118 17.236 10.943 C 17.501 10.767 17.818 10.518 17.995 10.131 C 18.226 9.628 18.226 9.049 17.995 8.547 C 17.818 8.159 17.501 7.911 17.236 7.735 C 16.972 7.559 16.624 7.371 16.23 7.158 L 5.371 1.288 Z M 1.778 2.557 C 1.624 2.045 2.167 1.603 2.638 1.857 L 16.316 9.251 C 16.34 9.264 16.35 9.277 16.356 9.286 C 16.363 9.299 16.368 9.317 16.368 9.339 C 16.368 9.361 16.363 9.379 16.356 9.391 C 16.35 9.401 16.34 9.413 16.316 9.427 L 2.638 16.82 C 2.167 17.075 1.624 16.632 1.778 16.12 L 3.544 10.239 L 8.871 10.239 C 9.368 10.239 9.771 9.836 9.771 9.339 C 9.771 8.842 9.368 8.439 8.871 8.439 L 3.544 8.439 L 1.778 2.557 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "setting": '<g transform="translate(2.271 1.800)"><path d="M 5.779 10.2 C 5.779 8.019 7.547 6.25 9.729 6.25 C 11.91 6.25 13.679 8.019 13.679 10.2 C 13.679 12.382 11.91 14.15 9.729 14.15 C 7.547 14.15 5.779 12.382 5.779 10.2 Z M 9.729 8.15 C 8.597 8.15 7.679 9.068 7.679 10.2 C 7.679 11.332 8.597 12.25 9.729 12.25 C 10.861 12.25 11.779 11.332 11.779 10.2 C 11.779 9.068 10.861 8.15 9.729 8.15 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 7.86 0.171 C 8.467 0.059 9.091 0 9.729 0 C 10.366 0 10.991 0.059 11.598 0.171 C 12.639 0.364 13.079 1.313 13.222 1.905 C 13.318 2.305 13.57 2.663 13.954 2.885 C 14.336 3.106 14.773 3.145 15.167 3.029 C 15.75 2.857 16.79 2.765 17.478 3.567 C 18.288 4.513 18.928 5.609 19.351 6.809 C 19.703 7.806 19.102 8.66 18.661 9.078 C 18.363 9.362 18.179 9.76 18.179 10.202 C 18.179 10.645 18.363 11.042 18.661 11.326 C 19.101 11.744 19.701 12.599 19.35 13.596 C 18.925 14.798 18.283 15.895 17.471 16.841 C 16.784 17.641 15.748 17.55 15.165 17.38 C 14.771 17.264 14.336 17.304 13.954 17.525 C 13.572 17.745 13.32 18.102 13.223 18.501 C 13.079 19.091 12.639 20.036 11.6 20.229 C 10.993 20.341 10.367 20.4 9.729 20.4 C 9.091 20.4 8.465 20.341 7.858 20.229 C 6.819 20.036 6.379 19.09 6.235 18.5 C 6.138 18.101 5.886 17.744 5.504 17.524 C 5.122 17.303 4.686 17.263 4.292 17.379 C 3.71 17.55 2.673 17.64 1.986 16.841 C 1.175 15.895 0.533 14.798 0.109 13.598 C -0.243 12.601 0.357 11.747 0.797 11.328 C 1.095 11.044 1.279 10.647 1.279 10.205 C 1.279 9.762 1.095 9.364 0.796 9.081 C 0.356 8.662 -0.246 7.809 0.106 6.811 C 0.528 5.611 1.168 4.515 1.978 3.569 C 2.666 2.766 3.706 2.858 4.29 3.03 C 4.684 3.147 5.121 3.107 5.504 2.886 C 5.887 2.665 6.14 2.306 6.236 1.906 C 6.378 1.314 6.818 0.364 7.86 0.171 Z M 8.228 2.035 C 8.223 2.04 8.217 2.046 8.209 2.056 C 8.168 2.11 8.117 2.211 8.083 2.35 C 7.87 3.236 7.307 4.039 6.454 4.531 C 5.602 5.023 4.625 5.11 3.752 4.853 C 3.615 4.812 3.503 4.806 3.436 4.816 C 3.423 4.817 3.414 4.819 3.408 4.821 C 2.759 5.582 2.246 6.462 1.905 7.422 C 1.907 7.428 1.909 7.436 1.914 7.448 C 1.94 7.511 2.001 7.605 2.104 7.703 C 2.765 8.331 3.179 9.22 3.179 10.205 C 3.179 11.188 2.766 12.077 2.107 12.704 C 2.004 12.803 1.942 12.897 1.917 12.96 C 1.912 12.971 1.909 12.98 1.908 12.986 C 2.25 13.946 2.764 14.826 3.414 15.587 C 3.42 15.588 3.429 15.59 3.442 15.592 C 3.509 15.601 3.621 15.596 3.758 15.556 C 4.629 15.3 5.604 15.387 6.454 15.878 C 7.304 16.369 7.867 17.169 8.081 18.052 C 8.115 18.19 8.166 18.29 8.208 18.343 C 8.215 18.353 8.222 18.36 8.226 18.364 C 8.713 18.453 9.215 18.5 9.729 18.5 C 10.243 18.5 10.745 18.453 11.232 18.364 C 11.236 18.36 11.243 18.353 11.25 18.343 C 11.292 18.29 11.343 18.19 11.377 18.052 C 11.591 17.169 12.154 16.37 13.004 15.879 C 13.854 15.388 14.828 15.301 15.7 15.556 C 15.836 15.596 15.948 15.602 16.015 15.593 C 16.028 15.591 16.037 15.589 16.043 15.587 C 16.694 14.826 17.208 13.945 17.551 12.984 C 17.549 12.978 17.546 12.969 17.541 12.958 C 17.516 12.895 17.455 12.801 17.351 12.703 C 16.692 12.075 16.279 11.186 16.279 10.202 C 16.279 9.218 16.692 8.328 17.352 7.701 C 17.456 7.603 17.517 7.509 17.543 7.446 C 17.547 7.434 17.55 7.426 17.552 7.42 C 17.211 6.46 16.698 5.581 16.049 4.82 C 16.043 4.818 16.034 4.816 16.021 4.814 C 15.954 4.805 15.841 4.811 15.704 4.851 C 14.832 5.109 13.855 5.022 13.004 4.53 C 12.151 4.038 11.588 3.235 11.374 2.349 C 11.341 2.21 11.29 2.11 11.248 2.056 C 11.24 2.046 11.234 2.04 11.23 2.035 C 10.744 1.946 10.242 1.9 9.729 1.9 C 9.216 1.9 8.714 1.946 8.228 2.035 Z M 17.554 7.409 L 17.554 7.411 Z M 17.553 12.995 L 17.553 12.993 Z M 1.905 12.997 L 1.906 12.994 Z M 1.903 7.411 L 1.903 7.413 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "share": '<g transform="translate(2.850 2.351)"><path d="M 14.9 0 C 13.022 0 11.5 1.522 11.5 3.4 C 11.5 3.667 11.531 3.926 11.589 4.175 L 5.852 7.293 C 5.233 6.65 4.363 6.249 3.4 6.249 C 1.522 6.249 0 7.771 0 9.649 C 0 11.527 1.522 13.049 3.4 13.049 C 4.363 13.049 5.232 12.649 5.85 12.006 L 11.589 15.125 C 11.531 15.373 11.5 15.633 11.5 15.899 C 11.5 17.777 13.022 19.299 14.9 19.299 C 16.778 19.299 18.3 17.777 18.3 15.899 C 18.3 14.021 16.778 12.499 14.9 12.499 C 13.937 12.499 13.067 12.9 12.448 13.543 L 6.711 10.425 C 6.769 10.176 6.8 9.916 6.8 9.649 C 6.8 9.383 6.769 9.123 6.711 8.875 L 12.449 5.756 C 13.068 6.4 13.937 6.8 14.9 6.8 C 16.778 6.8 18.3 5.278 18.3 3.4 C 18.3 1.522 16.778 0 14.9 0 Z M 13.3 3.4 C 13.3 2.516 14.016 1.8 14.9 1.8 C 15.784 1.8 16.5 2.516 16.5 3.4 C 16.5 4.284 15.784 5 14.9 5 C 14.016 5 13.3 4.284 13.3 3.4 Z M 1.8 9.649 C 1.8 8.765 2.516 8.049 3.4 8.049 C 4.284 8.049 5 8.765 5 9.649 C 5 10.533 4.284 11.249 3.4 11.249 C 2.516 11.249 1.8 10.533 1.8 9.649 Z M 13.3 15.899 C 13.3 15.015 14.016 14.299 14.9 14.299 C 15.784 14.299 16.5 15.015 16.5 15.899 C 16.5 16.783 15.784 17.499 14.9 17.499 C 14.016 17.499 13.3 16.783 13.3 15.899 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "sparkle": '<g transform="translate(1.910 2.001)"><path d="M 7.795 4.536 C 8.007 4.546 8.194 4.61 8.384 4.695 C 8.666 4.868 8.869 5.115 9.01 5.41 C 9.11 5.618 9.213 5.893 9.323 6.183 L 9.805 7.46 C 10.15 8.374 10.274 8.679 10.451 8.929 C 10.621 9.169 10.83 9.38 11.071 9.55 C 11.32 9.726 11.627 9.849 12.54 10.194 L 13.818 10.677 C 14.108 10.786 14.382 10.889 14.59 10.989 C 14.763 11.072 15.111 11.25 15.304 11.616 C 15.518 12.024 15.518 12.511 15.304 12.919 C 15.112 13.285 14.763 13.462 14.59 13.545 C 14.382 13.645 14.108 13.748 13.818 13.857 L 12.54 14.34 C 11.628 14.685 11.32 14.809 11.071 14.985 C 10.831 15.155 10.621 15.365 10.451 15.605 C 10.274 15.855 10.15 16.161 9.805 17.075 L 9.323 18.353 C 9.213 18.642 9.11 18.917 9.01 19.125 C 8.927 19.297 8.75 19.646 8.384 19.839 C 7.977 20.053 7.489 20.053 7.081 19.839 C 6.715 19.646 6.537 19.298 6.455 19.125 C 6.355 18.917 6.252 18.643 6.142 18.353 L 5.66 17.075 C 5.314 16.162 5.192 15.855 5.015 15.605 C 4.845 15.365 4.634 15.155 4.394 14.985 C 4.145 14.809 3.839 14.685 2.925 14.34 L 1.648 13.857 C 1.358 13.748 1.083 13.645 0.875 13.545 C 0.703 13.462 0.354 13.286 0.161 12.919 C -0.054 12.511 -0.054 12.024 0.161 11.616 C 0.354 11.25 0.703 11.072 0.875 10.989 C 1.083 10.89 1.358 10.786 1.648 10.677 L 2.925 10.194 C 3.838 9.849 4.145 9.726 4.394 9.55 C 4.634 9.38 4.845 9.169 5.015 8.929 C 5.191 8.679 5.315 8.373 5.66 7.46 L 6.142 6.183 C 6.252 5.893 6.355 5.618 6.455 5.41 C 6.538 5.237 6.715 4.888 7.081 4.695 C 7.304 4.578 7.551 4.525 7.795 4.536 Z M 7.342 8.096 C 7.03 8.922 6.824 9.488 6.484 9.969 C 6.196 10.376 5.84 10.732 5.433 11.02 C 4.952 11.36 4.386 11.566 3.56 11.878 L 2.53 12.267 L 3.56 12.656 C 4.386 12.969 4.952 13.175 5.433 13.516 C 5.84 13.804 6.196 14.159 6.484 14.566 C 6.824 15.048 7.03 15.613 7.342 16.438 L 7.731 17.468 L 8.121 16.438 C 8.433 15.613 8.64 15.048 8.98 14.566 C 9.268 14.16 9.624 13.804 10.031 13.516 C 10.512 13.175 11.077 12.968 11.903 12.656 L 12.932 12.267 L 11.903 11.878 C 11.077 11.566 10.512 11.36 10.031 11.02 C 9.624 10.732 9.268 10.376 8.98 9.969 C 8.639 9.487 8.433 8.922 8.121 8.096 L 7.731 7.065 L 7.342 8.096 Z" fill="currentColor" fill-rule="evenodd"></path> <path d="M 15.452 0 C 15.582 0 15.712 0.023 15.835 0.071 L 15.956 0.128 C 16.173 0.267 16.326 0.451 16.427 0.689 C 16.483 0.821 16.539 0.99 16.592 1.15 L 16.818 1.835 C 17.017 2.438 17.076 2.59 17.156 2.708 C 17.24 2.831 17.347 2.939 17.47 3.023 C 17.588 3.104 17.74 3.161 18.344 3.36 L 19.028 3.587 C 19.375 3.702 19.752 3.807 19.982 4.114 L 20.051 4.223 L 20.107 4.343 C 20.163 4.486 20.187 4.64 20.178 4.791 C 20.169 4.943 20.126 5.093 20.051 5.23 C 19.882 5.54 19.577 5.664 19.49 5.701 C 19.358 5.757 19.188 5.813 19.028 5.866 L 18.344 6.092 C 17.74 6.291 17.588 6.35 17.47 6.43 C 17.347 6.514 17.24 6.621 17.156 6.744 C 17.075 6.862 17.017 7.014 16.818 7.618 L 16.592 8.302 C 16.539 8.462 16.483 8.632 16.427 8.764 C 16.391 8.85 16.267 9.155 15.956 9.325 C 15.8 9.411 15.626 9.454 15.453 9.454 C 15.279 9.454 15.106 9.411 14.949 9.325 C 14.638 9.155 14.513 8.849 14.477 8.764 C 14.421 8.632 14.366 8.462 14.313 8.302 L 14.086 7.618 C 13.887 7.014 13.83 6.862 13.749 6.744 C 13.665 6.621 13.557 6.514 13.434 6.43 C 13.316 6.35 13.164 6.291 12.561 6.092 L 11.876 5.866 C 11.716 5.813 11.547 5.757 11.415 5.701 C 11.329 5.664 11.024 5.541 10.854 5.23 C 10.683 4.917 10.682 4.536 10.854 4.223 L 10.923 4.114 C 10.945 4.085 10.967 4.058 10.991 4.033 C 11.225 3.784 11.562 3.691 11.876 3.587 L 12.561 3.36 C 13.165 3.161 13.316 3.104 13.434 3.023 C 13.557 2.939 13.665 2.831 13.749 2.708 C 13.829 2.59 13.887 2.438 14.086 1.835 L 14.313 1.15 C 14.366 0.99 14.421 0.821 14.477 0.689 C 14.514 0.602 14.639 0.297 14.949 0.128 L 15.069 0.071 C 15.192 0.023 15.322 0 15.452 0 Z M 15.453 2.485 C 15.308 2.921 15.19 3.263 14.989 3.558 C 14.799 3.836 14.559 4.076 14.281 4.266 C 13.985 4.467 13.642 4.587 13.205 4.731 C 13.588 4.865 13.896 4.992 14.167 5.178 C 14.497 5.403 14.782 5.687 15.006 6.017 C 15.192 6.288 15.317 6.597 15.451 6.98 C 15.596 6.542 15.716 6.198 15.917 5.902 C 16.107 5.624 16.347 5.384 16.625 5.194 C 16.92 4.993 17.262 4.875 17.698 4.73 C 17.262 4.586 16.92 4.466 16.625 4.266 C 16.348 4.076 16.107 3.835 15.917 3.558 C 15.717 3.263 15.597 2.921 15.453 2.485 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "star-fill": '<g transform="translate(1.639 2.056)"><path d="M 11.222 0.207 C 10.681 -0.069 10.04 -0.069 9.499 0.207 C 9.065 0.428 8.815 0.838 8.649 1.155 C 8.473 1.49 8.286 1.939 8.068 2.464 L 6.863 5.361 C 6.791 5.535 6.752 5.628 6.719 5.695 C 6.709 5.715 6.702 5.728 6.698 5.734 C 6.692 5.74 6.686 5.745 6.678 5.749 C 6.671 5.751 6.657 5.753 6.635 5.756 C 6.561 5.767 6.46 5.775 6.273 5.79 L 3.144 6.041 C 2.578 6.087 2.094 6.125 1.721 6.189 C 1.367 6.249 0.9 6.359 0.556 6.704 C 0.126 7.134 -0.071 7.743 0.023 8.343 C 0.099 8.825 0.412 9.189 0.663 9.445 C 0.927 9.716 1.296 10.032 1.728 10.401 L 4.111 12.443 C 4.254 12.565 4.331 12.631 4.384 12.683 C 4.4 12.699 4.41 12.709 4.415 12.715 C 4.419 12.722 4.421 12.73 4.423 12.738 C 4.422 12.746 4.42 12.76 4.416 12.782 C 4.403 12.856 4.38 12.954 4.337 13.137 L 3.609 16.19 C 3.477 16.742 3.364 17.215 3.309 17.589 C 3.257 17.944 3.218 18.422 3.439 18.857 C 3.715 19.398 4.233 19.774 4.833 19.87 C 5.315 19.946 5.758 19.761 6.079 19.602 C 6.418 19.434 6.833 19.18 7.317 18.884 L 9.996 17.249 C 10.156 17.15 10.243 17.098 10.309 17.063 C 10.328 17.053 10.341 17.047 10.348 17.044 C 10.356 17.043 10.365 17.043 10.373 17.044 C 10.38 17.047 10.393 17.053 10.413 17.063 C 10.479 17.098 10.565 17.15 10.726 17.249 L 13.404 18.885 C 13.888 19.18 14.303 19.434 14.642 19.602 C 14.964 19.761 15.406 19.946 15.888 19.87 C 16.488 19.774 17.006 19.398 17.282 18.857 C 17.504 18.422 17.464 17.944 17.412 17.589 C 17.357 17.215 17.245 16.742 17.113 16.19 L 16.385 13.137 C 16.341 12.954 16.318 12.856 16.305 12.782 C 16.301 12.76 16.299 12.746 16.299 12.738 C 16.3 12.73 16.303 12.722 16.306 12.715 C 16.311 12.709 16.321 12.699 16.337 12.683 C 16.391 12.631 16.467 12.565 16.61 12.443 L 18.994 10.401 C 19.425 10.032 19.794 9.716 20.059 9.445 C 20.309 9.189 20.622 8.825 20.698 8.343 C 20.793 7.743 20.595 7.134 20.166 6.704 C 19.821 6.359 19.354 6.249 19.001 6.189 C 18.627 6.125 18.143 6.087 17.577 6.041 L 14.448 5.79 C 14.261 5.775 14.16 5.767 14.087 5.756 C 14.064 5.753 14.05 5.751 14.043 5.749 C 14.036 5.745 14.029 5.74 14.023 5.734 C 14.019 5.728 14.012 5.715 14.002 5.695 C 13.97 5.628 13.93 5.535 13.858 5.361 L 12.653 2.464 C 12.435 1.939 12.248 1.49 12.072 1.155 C 11.906 0.838 11.657 0.428 11.222 0.207 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "star": '<g transform="translate(1.639 2.056)"><path d="M 9.499 0.207 C 10.04 -0.069 10.681 -0.069 11.222 0.207 C 11.657 0.428 11.906 0.838 12.072 1.155 C 12.248 1.49 12.435 1.939 12.653 2.464 L 13.858 5.361 C 13.93 5.535 13.97 5.628 14.002 5.695 C 14.012 5.715 14.019 5.728 14.023 5.734 C 14.029 5.74 14.036 5.745 14.043 5.749 C 14.05 5.751 14.064 5.753 14.087 5.756 C 14.16 5.767 14.261 5.775 14.448 5.79 L 17.577 6.041 C 18.143 6.087 18.627 6.125 19.001 6.189 C 19.354 6.249 19.821 6.359 20.166 6.704 C 20.595 7.134 20.793 7.743 20.698 8.343 C 20.622 8.825 20.309 9.189 20.059 9.445 C 19.794 9.716 19.425 10.032 18.994 10.401 L 16.61 12.443 C 16.467 12.565 16.391 12.631 16.337 12.683 C 16.321 12.699 16.311 12.709 16.306 12.715 C 16.303 12.722 16.3 12.73 16.299 12.738 C 16.299 12.746 16.301 12.76 16.305 12.782 C 16.318 12.856 16.341 12.954 16.385 13.137 L 17.113 16.19 C 17.244 16.742 17.357 17.215 17.412 17.589 C 17.464 17.944 17.504 18.422 17.282 18.857 C 17.006 19.398 16.488 19.774 15.888 19.87 C 15.406 19.946 14.964 19.761 14.642 19.602 C 14.303 19.434 13.889 19.181 13.404 18.885 L 10.725 17.249 C 10.565 17.15 10.478 17.098 10.413 17.063 C 10.393 17.053 10.38 17.047 10.373 17.044 C 10.365 17.043 10.356 17.043 10.348 17.044 C 10.341 17.047 10.328 17.053 10.308 17.063 C 10.243 17.098 10.156 17.15 9.996 17.249 L 7.317 18.884 C 6.833 19.18 6.418 19.434 6.079 19.602 C 5.758 19.761 5.315 19.946 4.833 19.87 C 4.233 19.774 3.715 19.398 3.439 18.857 C 3.218 18.422 3.257 17.944 3.309 17.589 C 3.364 17.215 3.477 16.742 3.609 16.19 L 4.337 13.137 C 4.38 12.954 4.403 12.856 4.416 12.782 C 4.42 12.76 4.422 12.746 4.423 12.738 C 4.421 12.73 4.419 12.722 4.415 12.715 C 4.41 12.709 4.4 12.699 4.384 12.683 C 4.331 12.631 4.254 12.565 4.111 12.443 L 1.728 10.401 C 1.296 10.032 0.927 9.716 0.663 9.445 C 0.412 9.189 0.099 8.825 0.023 8.343 C -0.071 7.743 0.126 7.134 0.556 6.704 C 0.9 6.359 1.367 6.249 1.721 6.189 C 2.094 6.125 2.578 6.087 3.144 6.041 L 6.273 5.79 C 6.46 5.775 6.561 5.767 6.635 5.756 C 6.657 5.753 6.671 5.751 6.678 5.749 C 6.686 5.745 6.692 5.74 6.698 5.734 C 6.702 5.728 6.709 5.715 6.719 5.695 C 6.752 5.628 6.791 5.535 6.863 5.361 L 8.068 2.464 C 8.286 1.939 8.473 1.49 8.649 1.155 C 8.815 0.838 9.065 0.428 9.499 0.207 Z M 10.303 1.816 C 10.295 1.821 10.282 1.831 10.268 1.863 L 8.384 6.393 C 8.111 7.05 7.492 7.5 6.782 7.557 L 1.892 7.949 C 1.857 7.952 1.844 7.961 1.837 7.967 C 1.826 7.976 1.813 7.993 1.805 8.018 C 1.797 8.043 1.798 8.064 1.801 8.077 C 1.803 8.086 1.808 8.102 1.835 8.125 L 5.561 11.316 C 6.102 11.779 6.338 12.507 6.173 13.2 L 5.034 17.971 C 5.026 18.005 5.031 18.021 5.035 18.03 C 5.04 18.043 5.052 18.06 5.073 18.076 C 5.094 18.091 5.114 18.097 5.128 18.098 C 5.137 18.098 5.154 18.098 5.184 18.08 L 9.37 15.523 C 9.978 15.152 10.743 15.152 11.351 15.523 L 15.537 18.08 C 15.567 18.098 15.584 18.098 15.593 18.098 C 15.607 18.097 15.627 18.091 15.648 18.076 C 15.669 18.06 15.681 18.043 15.686 18.03 C 15.69 18.021 15.695 18.005 15.687 17.971 L 14.549 13.2 C 14.383 12.507 14.62 11.779 15.161 11.316 L 18.886 8.125 C 18.913 8.102 18.918 8.086 18.92 8.077 C 18.924 8.064 18.924 8.043 18.916 8.018 C 18.908 7.993 18.895 7.976 18.884 7.967 C 18.877 7.961 18.864 7.952 18.829 7.949 L 13.939 7.557 C 13.229 7.5 12.61 7.05 12.337 6.393 L 10.453 1.863 C 10.44 1.831 10.426 1.821 10.418 1.816 C 10.407 1.809 10.387 1.802 10.361 1.802 C 10.334 1.802 10.314 1.809 10.303 1.816 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "tag": '<g transform="translate(2.222 2.222)"><path d="M 13.657 7.153 C 14.348 7.153 14.907 6.593 14.907 5.903 C 14.907 5.212 14.348 4.653 13.657 4.653 C 12.967 4.653 12.407 5.212 12.407 5.903 C 12.407 6.593 12.967 7.153 13.657 7.153 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 12.05 0 C 11.409 0 10.94 0 10.49 0.108 C 10.092 0.203 9.711 0.361 9.362 0.575 C 8.967 0.817 8.636 1.148 8.183 1.602 L 2.388 7.396 C 1.817 7.968 1.35 8.435 1.001 8.846 C 0.64 9.271 0.353 9.694 0.191 10.195 C -0.064 10.978 -0.064 11.822 0.191 12.605 C 0.353 13.106 0.64 13.529 1.001 13.954 C 1.35 14.365 1.817 14.833 2.388 15.404 L 4.153 17.169 C 4.725 17.74 5.192 18.208 5.603 18.556 C 6.028 18.917 6.452 19.204 6.952 19.367 C 7.735 19.621 8.579 19.621 9.363 19.367 C 9.863 19.204 10.287 18.917 10.712 18.556 C 11.123 18.208 11.59 17.74 12.161 17.169 L 17.956 11.375 C 18.409 10.921 18.74 10.59 18.983 10.195 C 19.196 9.846 19.354 9.466 19.45 9.068 C 19.558 8.617 19.558 8.149 19.557 7.508 L 19.557 5.792 C 19.558 5.151 19.558 4.683 19.45 4.232 C 19.354 3.834 19.197 3.454 18.983 3.105 C 18.741 2.71 18.409 2.379 17.956 1.926 L 17.632 1.602 C 17.179 1.148 16.848 0.817 16.453 0.575 C 16.104 0.361 15.723 0.203 15.325 0.108 C 14.875 0 14.406 0 13.765 0 L 12.05 0 Z M 10.91 1.858 C 11.127 1.806 11.369 1.8 12.146 1.8 L 13.669 1.8 C 14.446 1.8 14.688 1.806 14.905 1.858 C 15.12 1.91 15.324 1.994 15.512 2.11 C 15.703 2.226 15.878 2.393 16.427 2.942 L 16.615 3.131 C 17.164 3.68 17.331 3.855 17.448 4.045 C 17.563 4.233 17.648 4.438 17.699 4.652 C 17.752 4.87 17.757 5.112 17.757 5.888 L 17.757 7.412 C 17.757 8.188 17.752 8.43 17.699 8.648 C 17.648 8.862 17.563 9.067 17.448 9.255 C 17.331 9.445 17.164 9.62 16.615 10.17 L 10.915 15.87 C 10.311 16.474 9.895 16.889 9.547 17.184 C 9.207 17.473 8.991 17.595 8.806 17.655 C 8.385 17.792 7.93 17.792 7.508 17.655 C 7.324 17.595 7.108 17.473 6.768 17.184 C 6.42 16.889 6.004 16.474 5.4 15.87 L 3.688 14.158 C 3.083 13.553 2.669 13.138 2.373 12.79 C 2.085 12.449 1.963 12.233 1.903 12.049 C 1.766 11.627 1.766 11.173 1.903 10.751 C 1.963 10.567 2.085 10.351 2.373 10.011 C 2.669 9.662 3.083 9.247 3.688 8.642 L 9.388 2.942 C 9.937 2.393 10.112 2.226 10.303 2.11 C 10.491 1.994 10.695 1.91 10.91 1.858 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "trash": '<g transform="translate(3.100 1.851)"><path d="M 6.9 8.747 C 7.397 8.747 7.8 9.149 7.8 9.647 L 7.8 14.647 C 7.8 15.144 7.397 15.547 6.9 15.547 C 6.403 15.547 6 15.144 6 14.647 L 6 9.647 C 6 9.149 6.403 8.747 6.9 8.747 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 10.9 8.747 C 11.397 8.747 11.8 9.149 11.8 9.647 L 11.8 14.647 C 11.8 15.144 11.397 15.547 10.9 15.547 C 10.403 15.547 10 15.144 10 14.647 L 10 9.647 C 10 9.149 10.403 8.747 10.9 8.747 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 16.9 3.997 L 13.3 3.997 C 13.3 3.496 13.299 3.068 13.27 2.713 C 13.238 2.324 13.168 1.945 12.984 1.583 C 12.706 1.038 12.262 0.594 11.716 0.316 C 11.354 0.132 10.976 0.062 10.587 0.03 C 10.216 0 9.765 0 9.235 0 L 8.564 0 C 8.035 0 7.583 0 7.213 0.03 C 6.824 0.062 6.445 0.132 6.083 0.316 C 5.538 0.594 5.094 1.038 4.816 1.583 C 4.632 1.945 4.562 2.324 4.53 2.713 C 4.501 3.068 4.5 3.496 4.5 3.997 L 0.9 3.997 C 0.403 3.997 0 4.4 0 4.897 C 0 5.394 0.403 5.797 0.9 5.797 L 1.5 5.797 L 1.5 16.233 C 1.5 16.763 1.5 17.214 1.53 17.585 C 1.562 17.974 1.632 18.353 1.816 18.714 C 2.094 19.26 2.538 19.704 3.083 19.982 C 3.445 20.166 3.824 20.236 4.213 20.268 C 4.583 20.298 5.035 20.298 5.564 20.298 L 12.235 20.298 C 12.765 20.298 13.216 20.298 13.587 20.268 C 13.976 20.236 14.354 20.166 14.716 19.982 C 15.262 19.704 15.706 19.26 15.984 18.714 C 16.168 18.353 16.238 17.974 16.27 17.585 C 16.3 17.214 16.3 16.763 16.3 16.233 L 16.3 5.797 L 16.9 5.797 C 17.397 5.797 17.8 5.394 17.8 4.897 C 17.8 4.4 17.397 3.997 16.9 3.997 Z M 11.5 3.997 L 6.3 3.997 L 6.3 3.691 C 6.3 2.876 6.311 2.682 6.354 2.551 C 6.463 2.216 6.725 1.954 7.06 1.845 C 7.192 1.802 7.386 1.791 8.2 1.791 L 9.6 1.791 C 10.415 1.791 10.609 1.802 10.74 1.845 C 11.075 1.954 11.338 2.216 11.446 2.551 C 11.489 2.682 11.5 2.876 11.5 3.691 L 11.5 3.997 Z M 3.3 16.591 L 3.3 5.797 L 14.5 5.797 L 14.5 16.591 C 14.5 17.406 14.489 17.6 14.446 17.731 C 14.338 18.066 14.075 18.329 13.74 18.438 C 13.609 18.48 13.415 18.491 12.6 18.491 L 5.2 18.491 C 4.386 18.491 4.192 18.48 4.06 18.438 C 3.725 18.329 3.463 18.066 3.354 17.731 C 3.311 17.6 3.3 17.406 3.3 16.591 Z" fill="currentColor" fill-rule="evenodd"></path></g>', "upload": '<g transform="translate(2.850 2.725)"><path d="M 9.15 0 C 9.407 0 9.64 0.108 9.804 0.282 L 14.286 4.764 C 14.638 5.116 14.638 5.685 14.286 6.037 C 13.935 6.388 13.365 6.388 13.013 6.037 L 10.05 3.073 L 10.05 12.4 C 10.05 12.897 9.647 13.3 9.15 13.3 C 8.653 13.3 8.25 12.897 8.25 12.4 L 8.25 3.073 L 5.286 6.037 C 4.935 6.388 4.365 6.388 4.013 6.037 C 3.662 5.685 3.662 5.116 4.013 4.764 L 8.496 0.282 C 8.66 0.108 8.892 0 9.15 0 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 18.3 12.3 C 18.3 11.803 17.897 11.4 17.4 11.4 C 16.903 11.4 16.5 11.803 16.5 12.3 L 16.5 14.85 C 16.5 15.665 16.489 15.859 16.446 15.99 C 16.337 16.325 16.075 16.588 15.74 16.696 C 15.608 16.739 15.415 16.75 14.6 16.75 L 3.7 16.75 C 2.885 16.75 2.692 16.739 2.56 16.696 C 2.225 16.588 1.963 16.325 1.854 15.99 C 1.811 15.859 1.8 15.665 1.8 14.85 L 1.8 12.3 C 1.8 11.803 1.397 11.4 0.9 11.4 C 0.403 11.4 0 11.803 0 12.3 L 0 14.486 C 0 15.015 0 15.467 0.03 15.837 C 0.062 16.226 0.132 16.605 0.316 16.967 C 0.594 17.512 1.038 17.956 1.583 18.234 C 1.945 18.419 2.324 18.488 2.713 18.52 C 3.084 18.55 3.535 18.55 4.065 18.55 L 14.235 18.55 C 14.765 18.55 15.216 18.55 15.587 18.52 C 15.976 18.488 16.355 18.419 16.717 18.234 C 17.262 17.956 17.706 17.512 17.984 16.967 C 18.168 16.605 18.238 16.226 18.27 15.837 C 18.3 15.467 18.3 15.016 18.3 14.486 L 18.3 12.3 Z" fill="currentColor" fill-rule="nonzero"></path></g>', "verified-check": '<g transform="translate(1.600 1.600)"><path d="M 14.286 8.786 C 14.638 8.434 14.638 7.865 14.286 7.513 C 13.935 7.162 13.365 7.162 13.013 7.513 L 9.15 11.377 L 7.786 10.013 C 7.435 9.662 6.865 9.662 6.514 10.013 C 6.162 10.364 6.162 10.934 6.513 11.286 L 8.513 13.286 C 8.682 13.455 8.911 13.549 9.15 13.549 C 9.388 13.549 9.617 13.455 9.786 13.286 L 14.286 8.786 Z" fill="currentColor" fill-rule="nonzero"></path> <path d="M 8.425 0.827 C 9.511 -0.276 11.289 -0.275 12.375 0.827 L 13.488 1.956 C 13.672 2.144 13.924 2.248 14.187 2.246 L 15.773 2.234 C 17.32 2.223 18.577 3.48 18.566 5.027 L 18.554 6.613 C 18.552 6.876 18.656 7.128 18.844 7.312 L 19.973 8.425 C 21.075 9.511 21.075 11.289 19.973 12.375 L 18.844 13.488 C 18.656 13.672 18.552 13.925 18.554 14.187 L 18.566 15.773 C 18.577 17.32 17.32 18.577 15.773 18.566 L 14.187 18.554 C 13.924 18.552 13.672 18.656 13.487 18.844 L 12.375 19.973 C 11.289 21.076 9.511 21.076 8.425 19.973 L 7.312 18.844 C 7.128 18.656 6.875 18.552 6.613 18.554 L 5.027 18.566 C 3.48 18.577 2.223 17.32 2.234 15.773 L 2.246 14.187 C 2.248 13.925 2.144 13.672 1.956 13.488 L 0.827 12.375 C -0.276 11.289 -0.276 9.511 0.827 8.425 L 1.956 7.312 C 2.144 7.128 2.248 6.876 2.246 6.613 L 2.234 5.027 C 2.223 3.48 3.48 2.223 5.027 2.234 L 6.613 2.246 C 6.875 2.248 7.128 2.144 7.312 1.956 L 8.425 0.827 Z M 11.092 2.09 C 10.712 1.703 10.088 1.703 9.708 2.09 L 8.595 3.22 C 8.069 3.754 7.349 4.052 6.599 4.046 L 5.013 4.034 C 4.471 4.03 4.03 4.471 4.034 5.013 L 4.046 6.599 C 4.052 7.349 3.754 8.069 3.22 8.595 L 2.09 9.708 C 1.703 10.088 1.703 10.712 2.09 11.092 L 3.22 12.205 C 3.754 12.731 4.052 13.451 4.046 14.201 L 4.034 15.787 C 4.03 16.329 4.471 16.77 5.013 16.766 L 6.599 16.754 C 7.349 16.748 8.069 17.046 8.595 17.58 L 9.708 18.71 C 10.088 19.097 10.712 19.097 11.092 18.71 L 12.205 17.58 C 12.731 17.046 13.451 16.748 14.201 16.754 L 15.787 16.766 C 16.329 16.77 16.77 16.329 16.766 15.787 L 16.754 14.201 C 16.748 13.451 17.046 12.731 17.58 12.205 L 18.71 11.092 C 19.097 10.712 19.097 10.088 18.71 9.708 L 17.58 8.595 C 17.046 8.069 16.748 7.349 16.754 6.599 L 16.766 5.013 C 16.77 4.471 16.329 4.03 15.787 4.034 L 14.201 4.046 C 13.451 4.052 12.731 3.753 12.205 3.22 L 11.092 2.09 Z" fill="currentColor" fill-rule="evenodd"></path></g>' };
function Icon({ name, size = 24, color, style, className, ...rest }) {
  const inner = FILL_ICONS[name] != null ? FILL_ICONS[name] : LINE_ICONS[name] != null ? LINE_OPEN + LINE_ICONS[name] + LINE_CLOSE : void 0;
  if (!inner) {
    return React79.createElement("svg", { width: size, height: size, viewBox: "0 0 24 24", style, className, ...rest });
  }
  return React79.createElement("svg", {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: "currentColor",
    role: "img",
    "aria-label": name,
    className,
    style: { display: "block", color, flexShrink: 0, ...style },
    dangerouslySetInnerHTML: { __html: inner },
    ...rest
  });
}

// components/layout/AspectRatio.jsx
import React80 from "react";
import { jsx as jsx78 } from "react/jsx-runtime";
function AspectRatio({ children, ratio = 16 / 9, style, ...rest }) {
  return /* @__PURE__ */ jsx78("div", { style: { position: "relative", width: "100%", aspectRatio: String(ratio), overflow: "hidden", ...style }, ...rest, children });
}

// components/layout/Center.jsx
import React81 from "react";
import { jsx as jsx79 } from "react/jsx-runtime";
function Center({ children, minHeight, style, ...rest }) {
  return /* @__PURE__ */ jsx79("div", { style: { display: "flex", alignItems: "center", justifyContent: "center", minHeight, ...style }, ...rest, children });
}

// components/layout/Cluster.jsx
import React82 from "react";
import { jsx as jsx80 } from "react/jsx-runtime";
function Cluster({ children, gap = 10, align = "center", justify = "flex-start", style, ...rest }) {
  return /* @__PURE__ */ jsx80("div", { style: { display: "flex", flexWrap: "wrap", gap, alignItems: align, justifyContent: justify, ...style }, ...rest, children });
}

// components/layout/Col.jsx
import React83 from "react";
import { jsx as jsx81 } from "react/jsx-runtime";
function Col({ children, span, sm, md, lg, style, ...rest }) {
  const vars = {};
  if (span != null) vars["--col-span"] = span;
  if (sm != null) vars["--col-span-sm"] = sm;
  if (md != null) vars["--col-span-md"] = md;
  if (lg != null) vars["--col-span-lg"] = lg;
  return /* @__PURE__ */ jsx81("div", { className: "lk-col", style: { ...vars, ...style }, ...rest, children });
}

// components/layout/Columns.jsx
import React84 from "react";
import { jsx as jsx82 } from "react/jsx-runtime";
var toLen2 = (v) => typeof v === "number" ? v + "px" : v;
function Columns({ children, columns = 12, gap, columnGap, rowGap, style, ...rest }) {
  const vars = { "--cols": columns };
  if (gap != null) {
    vars["--col-gap"] = toLen2(gap);
    vars["--row-gap"] = toLen2(gap);
  }
  if (columnGap != null) vars["--col-gap"] = toLen2(columnGap);
  if (rowGap != null) vars["--row-gap"] = toLen2(rowGap);
  return /* @__PURE__ */ jsx82("div", { className: "lk-grid", style: { ...vars, ...style }, ...rest, children });
}

// components/layout/Container.jsx
import React85 from "react";
import { jsx as jsx83 } from "react/jsx-runtime";
function Container({ children, size = "default", style, ...rest }) {
  if (size === "default") {
    return /* @__PURE__ */ jsx83("div", { className: "lk-container-fluid", style, ...rest, children });
  }
  const max = size === "read" ? "var(--container-read)" : "var(--container-wide)";
  return /* @__PURE__ */ jsx83("div", { style: { maxWidth: max, marginInline: "auto", paddingInline: "var(--grid-margin)", width: "100%", boxSizing: "border-box", ...style }, ...rest, children });
}

// components/layout/Grid.jsx
import React86 from "react";
import { jsx as jsx84 } from "react/jsx-runtime";
function Grid({ children, columns, minItemWidth, gap = 20, style, ...rest }) {
  const template = minItemWidth ? `repeat(auto-fill, minmax(${typeof minItemWidth === "number" ? minItemWidth + "px" : minItemWidth}, 1fr))` : columns ? `repeat(${columns}, minmax(0, 1fr))` : void 0;
  return /* @__PURE__ */ jsx84("div", { style: { display: "grid", gridTemplateColumns: template, gap, ...style }, ...rest, children });
}

// components/layout/ScrollArea.jsx
import React87 from "react";
import { jsx as jsx85 } from "react/jsx-runtime";
function useScrollStyles() {
  React87.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-scrollarea-css")) return;
    const el = document.createElement("style");
    el.id = "lk-scrollarea-css";
    el.textContent = ".lk-scrollarea{scrollbar-width:thin;scrollbar-color:var(--bw-gray-300) transparent;}.lk-scrollarea::-webkit-scrollbar{width:7px;height:7px;}.lk-scrollarea::-webkit-scrollbar-thumb{background:var(--bw-gray-300);border-radius:99px;}.lk-scrollarea::-webkit-scrollbar-thumb:hover{background:var(--bw-gray);}.lk-scrollarea::-webkit-scrollbar-track{background:transparent;}";
    document.head.appendChild(el);
  }, []);
}
function ScrollArea({ children, maxHeight = 280, style, ...rest }) {
  useScrollStyles();
  return /* @__PURE__ */ jsx85("div", { className: "lk-scrollarea", style: { maxHeight, overflow: "auto", ...style }, ...rest, children });
}

// components/layout/Section.jsx
import React88 from "react";
import { jsx as jsx86 } from "react/jsx-runtime";
var toLen3 = (v) => typeof v === "number" ? v + "px" : v;
var SURFACES = {
  subtle: "var(--surface-subtle)",
  band: "var(--surface-sunken)",
  raised: "var(--surface-raised)",
  inverse: "var(--surface-inverse)"
};
function Section({ children, surface, py, container = true, innerStyle, style, ...rest }) {
  const outer = {
    background: surface ? SURFACES[surface] : void 0,
    color: surface === "inverse" ? "var(--text-on-inverse)" : void 0,
    ...py != null ? { "--section-py": toLen3(py) } : {},
    ...style
  };
  const inner = container ? /* @__PURE__ */ jsx86("div", { className: "lk-container-fluid", style: innerStyle, children }) : children;
  return /* @__PURE__ */ jsx86("section", { className: "lk-section", style: outer, ...rest, children: inner });
}

// components/layout/Spacer.jsx
import React89 from "react";
import { jsx as jsx87 } from "react/jsx-runtime";
function Spacer({ size, axis = "vertical", style, ...rest }) {
  if (size == null) return /* @__PURE__ */ jsx87("span", { style: { flex: 1, ...style }, ...rest });
  return /* @__PURE__ */ jsx87("span", { style: { display: "block", flexShrink: 0, width: axis === "horizontal" ? size : void 0, height: axis === "vertical" ? size : void 0, ...style }, ...rest });
}

// components/layout/Split.jsx
import React90 from "react";
import { jsx as jsx88 } from "react/jsx-runtime";
var toLen4 = (v) => typeof v === "number" ? v + "px" : v;
function Split({ children, template = "1fr 1fr", at = "md", gap, style, ...rest }) {
  const vars = { "--split-template": template };
  if (gap != null) vars["--split-gap"] = toLen4(gap);
  return /* @__PURE__ */ jsx88("div", { className: "lk-split", "data-at": at === "lg" ? "lg" : void 0, style: { ...vars, ...style }, ...rest, children });
}

// components/layout/Stack.jsx
import React91 from "react";
import { jsx as jsx89 } from "react/jsx-runtime";
function Stack({ children, direction = "column", gap = 16, align, justify, wrap = false, as = "div", style, ...rest }) {
  const Comp = as;
  return /* @__PURE__ */ jsx89(Comp, { style: { display: "flex", flexDirection: direction, gap, alignItems: align, justifyContent: justify, flexWrap: wrap ? "wrap" : "nowrap", ...style }, ...rest, children });
}

// components/layout/VisuallyHidden.jsx
import React92 from "react";
import { jsx as jsx90 } from "react/jsx-runtime";
function VisuallyHidden({ children, as = "span", ...rest }) {
  const Comp = as;
  return /* @__PURE__ */ jsx90(Comp, { style: { position: "absolute", width: 1, height: 1, padding: 0, margin: -1, overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", border: 0 }, ...rest, children });
}

// components/navigation/Anchor.jsx
import React93 from "react";
import { jsx as jsx91 } from "react/jsx-runtime";
function Anchor({ items = [], active, onChange, style, ...rest }) {
  const isControlled = active !== void 0;
  const [internal, setInternal] = React93.useState(items[0] && items[0].href);
  const cur = isControlled ? active : internal;
  return /* @__PURE__ */ jsx91("nav", { style: { display: "flex", flexDirection: "column", gap: 2, fontFamily: "var(--font-sans)", ...style }, ...rest, children: items.map((it) => {
    const on = it.href === cur;
    return /* @__PURE__ */ jsx91(
      "a",
      {
        href: it.href,
        onClick: () => {
          if (!isControlled) setInternal(it.href);
          onChange && onChange(it.href);
        },
        style: { display: "block", padding: "7px 12px", paddingLeft: 12 + (it.level || 0) * 14, borderLeft: `2px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, color: on ? "var(--lk-accent-ink)" : "var(--label-alternative)", fontSize: 14, fontWeight: on ? "var(--fw-bold)" : "var(--fw-medium)", textDecoration: "none", transition: "color var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out)" },
        children: it.label
      },
      it.href
    );
  }) });
}

// components/navigation/BottomNav.jsx
import React94 from "react";
import { jsx as jsx92, jsxs as jsxs60 } from "react/jsx-runtime";
function BottomNav({ items = [], value, defaultValue, onChange, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React94.useState(defaultValue != null ? defaultValue : items[0] && items[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx92("nav", { style: { display: "flex", alignItems: "stretch", background: "var(--bw-white)", borderTop: "1px solid var(--bw-border)", ...style }, ...rest, children: items.map((o) => {
    const active = o.value === val;
    return /* @__PURE__ */ jsxs60(
      "button",
      {
        type: "button",
        "aria-current": active ? "page" : void 0,
        onClick: () => pick(o.value),
        style: {
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 4,
          padding: "9px 4px",
          minHeight: 58,
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: active ? "var(--lk-accent-ink)" : "var(--label-assistive)",
          transition: "color var(--dur-fast) var(--ease-out)"
        },
        children: [
          o.icon,
          /* @__PURE__ */ jsx92("span", { style: { fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0 }, children: o.label })
        ]
      },
      o.value
    );
  }) });
}

// components/navigation/Breadcrumb.jsx
import React95 from "react";
import { jsx as jsx93, jsxs as jsxs61 } from "react/jsx-runtime";
function Breadcrumb({ items = [], style, ...rest }) {
  return /* @__PURE__ */ jsx93("nav", { "aria-label": "breadcrumb", style: { display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, fontFamily: "var(--font-sans)", fontSize: 13.5, ...style }, ...rest, children: items.map((it, i) => {
    const last = i === items.length - 1;
    return /* @__PURE__ */ jsxs61(React95.Fragment, { children: [
      last || !it.href ? /* @__PURE__ */ jsx93("span", { "aria-current": last ? "page" : void 0, style: { color: last ? "var(--label-normal)" : "var(--label-alternative)", fontWeight: last ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0 }, children: it.label }) : /* @__PURE__ */ jsx93("a", { href: it.href, style: { color: "var(--label-alternative)", fontWeight: "var(--fw-medium)", letterSpacing: 0, textDecoration: "none" }, children: it.label }),
      !last && /* @__PURE__ */ jsx93("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-assistive)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx93("path", { d: "m9 18 6-6-6-6" }) })
    ] }, i);
  }) });
}

// components/navigation/FloorSelector.jsx
import React96 from "react";
import { jsx as jsx94 } from "react/jsx-runtime";
function FloorSelector({ floors = [], value, defaultValue, onChange, style, ...rest }) {
  const controlled = value !== void 0;
  const norm = floors.map((f) => typeof f === "string" ? { value: f, label: f } : f);
  const [internal, setInternal] = React96.useState(defaultValue != null ? defaultValue : norm[0] && norm[0].value);
  const cur = controlled ? value : internal;
  const pick = (v) => {
    if (!controlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx94("div", { role: "listbox", "aria-label": "\uCE35 \uC120\uD0DD", style: {
    display: "inline-flex",
    flexDirection: "column",
    gap: 3,
    padding: 4,
    background: "var(--surface-raised)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-1)",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: norm.map((f) => {
    const on = f.value === cur;
    return /* @__PURE__ */ jsx94(
      "button",
      {
        type: "button",
        role: "option",
        "aria-selected": on,
        onClick: () => pick(f.value),
        style: {
          minWidth: 44,
          height: 40,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: 0,
          borderRadius: "var(--radius-sm)",
          cursor: "pointer",
          fontSize: 14,
          fontWeight: on ? 800 : 600,
          background: on ? "var(--lk-accent-ink)" : "transparent",
          color: on ? "#fff" : "var(--label-neutral)",
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: f.label
      },
      f.value
    );
  }) });
}

// components/navigation/Footer.jsx
import React97 from "react";
import { jsx as jsx95, jsxs as jsxs62 } from "react/jsx-runtime";
var DEFAULT_CONTACT = [
  { label: "\uB300\uD45C\uC804\uD654", value: "02-3159-2865" },
  { label: "\uC0AC\uC5C5\uC790\uB4F1\uB85D\uBC88\uD638", value: "391-81-03300" }
];
var DEFAULT_LOCATIONS = [
  { label: "\uBCF8\uC0AC", value: "\uB300\uC804\uAD11\uC5ED\uC2DC \uC720\uC131\uAD6C \uD14C\uD06C\uB1783\uB85C 65, \uD55C\uC2E0\uC5D0\uC2A4\uBA54\uCE74 633\uD638" },
  { label: "R&D \uC13C\uD130", value: "\uC11C\uC6B8\uD2B9\uBCC4\uC2DC \uB9C8\uD3EC\uAD6C \uBC31\uBC94\uB85C31\uAE38 21, \uC11C\uC6B8\uCC3D\uC5C5\uD5C8\uBE0C \uBCC4\uAD00 306\uD638" },
  { label: "\uACF5\uC7A5", value: "\uACBD\uAE30\uB3C4 \uACE0\uC591\uC2DC \uB355\uC591\uAD6C \uAF43\uB9C8\uC744\uB85C 38, DMC \uC2A4\uD0C0\uBE44\uC988 7st \uD574\uB9C1\uD134\uD0C0\uC6CC 613\uD638" }
];
var DEFAULT_COPYRIGHT = "Copyright \u24D2 2024 - 2026 LK ROBOTICS Inc. All rights reserved.";
function BackToTopButton() {
  const [show, setShow] = React97.useState(false);
  React97.useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const toTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };
  return /* @__PURE__ */ jsx95(
    "button",
    {
      type: "button",
      onClick: toTop,
      "aria-label": "\uB9E8 \uC704\uB85C",
      style: {
        position: "fixed",
        right: 28,
        bottom: 28,
        zIndex: 60,
        width: 50,
        height: 50,
        borderRadius: 999,
        border: "1px solid var(--bw-border)",
        background: "var(--bw-white)",
        color: "var(--bw-ink)",
        cursor: "pointer",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "var(--shadow-md)",
        opacity: show ? 1 : 0,
        transform: show ? "none" : "translateY(8px)",
        pointerEvents: show ? "auto" : "none",
        transition: "opacity 180ms var(--ease-out), transform 180ms var(--ease-out)"
      },
      children: /* @__PURE__ */ jsx95("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx95("path", { d: "m18 15-6-6-6 6" }) })
    }
  );
}
function Footer({
  contact = DEFAULT_CONTACT,
  locations = DEFAULT_LOCATIONS,
  copyright = DEFAULT_COPYRIGHT,
  brand,
  columns = [],
  links = [],
  compact = false,
  backToTop = false,
  maxWidth = 1280,
  style,
  ...rest
}) {
  const [hov, setHov] = React97.useState(null);
  const linkEl = (key, l, base, hover, size, weight) => /* @__PURE__ */ jsx95(
    "a",
    {
      href: l.href || "#",
      onMouseEnter: () => setHov(key),
      onMouseLeave: () => setHov(null),
      style: { fontFamily: "var(--font-sans)", fontSize: size, fontWeight: weight || "var(--fw-medium)", lineHeight: 1.5, letterSpacing: 0, textDecoration: "none", whiteSpace: "nowrap", color: hov === key ? hover : base, transition: "color 160ms ease", wordBreak: "keep-all" },
      children: l.label
    },
    key
  );
  if (compact) {
    return /* @__PURE__ */ jsxs62("footer", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px 24px", flexWrap: "wrap", padding: "14px 2px", borderTop: "1px solid var(--border-subtle)", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
      /* @__PURE__ */ jsx95("span", { style: { fontSize: 12.5, letterSpacing: 0, color: "var(--label-assistive)" }, children: copyright }),
      links.length > 0 && /* @__PURE__ */ jsx95("span", { style: { display: "flex", alignItems: "center", gap: 18 }, children: links.map((l, i) => linkEl("c" + i, l, "var(--label-alternative)", "var(--label-normal)", 12.5)) })
    ] });
  }
  const entryRow = (items) => /* @__PURE__ */ jsx95("div", { style: { display: "flex", flexWrap: "wrap", gap: "4px 14px" }, children: items.map((it, i) => /* @__PURE__ */ jsxs62("span", { style: { whiteSpace: "nowrap" }, children: [
    /* @__PURE__ */ jsx95("span", { style: { color: "rgba(255, 255, 255, 0.62)", fontWeight: 700 }, children: it.label }),
    " ",
    it.value
  ] }, i)) });
  return /* @__PURE__ */ jsxs62("footer", { style: { background: "var(--surface-inverse)", padding: "32px 0 40px", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    backToTop && /* @__PURE__ */ jsx95(BackToTopButton, {}),
    /* @__PURE__ */ jsxs62("div", { style: { maxWidth, margin: "0 auto", padding: "0 32px", boxSizing: "border-box" }, children: [
      (brand != null || columns.length > 0) && /* @__PURE__ */ jsxs62(React97.Fragment, { children: [
        /* @__PURE__ */ jsxs62("div", { style: { display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: "36px 48px", paddingTop: 20 }, children: [
          brand != null && /* @__PURE__ */ jsx95("div", { style: { flex: "1 1 240px", minWidth: 220 }, children: brand }),
          columns.map((col, ci) => /* @__PURE__ */ jsxs62("nav", { "aria-label": typeof col.heading === "string" ? col.heading : void 0, style: { display: "flex", flexDirection: "column", gap: 11, minWidth: 108 }, children: [
            col.heading != null && /* @__PURE__ */ jsx95("span", { style: { fontSize: 15, fontWeight: 800, letterSpacing: 0, lineHeight: 1.5, color: "#fff", marginBottom: 2, wordBreak: "keep-all" }, children: col.heading }),
            (col.links || []).map((l, li) => linkEl(ci + "-" + li, l, "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.92)", 13.5))
          ] }, ci))
        ] }),
        /* @__PURE__ */ jsx95("div", { style: { height: 1, background: "rgba(255, 255, 255, 0.14)", margin: "32px 0 24px" } })
      ] }),
      /* @__PURE__ */ jsxs62("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 8, fontSize: 13, lineHeight: 1.6, color: "rgba(255, 255, 255, 0.45)", wordBreak: "keep-all" }, children: [
        contact.length > 0 && entryRow(contact),
        locations.length > 0 && entryRow(locations),
        /* @__PURE__ */ jsxs62("span", { style: { marginTop: 18, display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 20px", color: "rgba(255, 255, 255, 0.38)" }, children: [
          copyright,
          links.length > 0 && /* @__PURE__ */ jsx95("span", { style: { display: "flex", alignItems: "center", gap: 16 }, children: links.map((l, i) => linkEl("p" + i, l, "rgba(255, 255, 255, 0.5)", "rgba(255, 255, 255, 0.92)", 12.5)) })
        ] })
      ] })
    ] })
  ] });
}

// components/navigation/Menubar.jsx
import React98 from "react";
import { jsx as jsx96, jsxs as jsxs63 } from "react/jsx-runtime";
function Menubar({ menus = [], style, ...rest }) {
  const [open, setOpen] = React98.useState(-1);
  const ref = React98.useRef(null);
  React98.useEffect(() => {
    if (open < 0) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(-1);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return /* @__PURE__ */ jsx96("div", { ref, role: "menubar", style: { display: "inline-flex", alignItems: "center", gap: 2, padding: 4, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", ...style }, ...rest, children: menus.map((m, i) => /* @__PURE__ */ jsxs63("div", { style: { position: "relative" }, children: [
    /* @__PURE__ */ jsx96(
      "button",
      {
        type: "button",
        onClick: () => setOpen((o) => o === i ? -1 : i),
        onMouseEnter: () => {
          if (open >= 0) setOpen(i);
        },
        style: { height: 34, padding: "0 12px", border: "none", borderRadius: "var(--radius-sm)", background: open === i ? "var(--fill-normal)" : "transparent", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: "var(--fw-semibold)", color: "var(--label-normal)" },
        children: m.label
      }
    ),
    open === i && /* @__PURE__ */ jsx96("div", { role: "menu", style: { position: "absolute", top: "calc(100% + 6px)", left: 0, zIndex: 40, minWidth: 184, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 6 }, children: (m.items || []).map((it, j) => it.divider ? /* @__PURE__ */ jsx96("div", { style: { height: 1, background: "var(--bw-border)", margin: "6px 4px" } }, j) : /* @__PURE__ */ jsxs63(
      "button",
      {
        type: "button",
        onClick: () => {
          setOpen(-1);
          it.onClick && it.onClick();
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "var(--fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "8px 12px", border: "none", background: "transparent", cursor: "pointer", borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 14, color: "var(--label-normal)" },
        children: [
          /* @__PURE__ */ jsx96("span", { children: it.label }),
          it.shortcut && /* @__PURE__ */ jsx96("span", { style: { fontSize: 12, color: "var(--label-assistive)" }, children: it.shortcut })
        ]
      },
      j
    )) })
  ] }, i)) });
}

// components/navigation/NavRail.jsx
import React99 from "react";
import { jsx as jsx97, jsxs as jsxs64 } from "react/jsx-runtime";
function NavRail({ items = [], value, defaultValue, onChange, style, ...rest }) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React99.useState(defaultValue != null ? defaultValue : items[0] && items[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx97("nav", { style: { display: "inline-flex", flexDirection: "column", gap: 6, padding: 10, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-xl)", ...style }, ...rest, children: items.map((o) => {
    const active = o.value === val;
    return /* @__PURE__ */ jsxs64(
      "button",
      {
        type: "button",
        "aria-current": active ? "page" : void 0,
        onClick: () => pick(o.value),
        title: typeof o.label === "string" ? o.label : void 0,
        style: { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 5, width: 68, height: 60, border: "none", borderRadius: "var(--radius-lg)", cursor: "pointer", background: active ? "var(--lk-accent-tint-2)" : "transparent", color: active ? "var(--lk-accent-ink)" : "var(--label-alternative)", transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)" },
        children: [
          o.icon,
          /* @__PURE__ */ jsx97("span", { style: { fontFamily: "var(--font-sans)", fontSize: 11, fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)" }, children: o.label })
        ]
      },
      o.value
    );
  }) });
}

// components/navigation/Pagination.jsx
import React100 from "react";
import { jsx as jsx98, jsxs as jsxs65 } from "react/jsx-runtime";
function Pagination({ page = 1, count = 1, onChange, siblingCount = 1, style, ...rest }) {
  const go = (p) => {
    if (p >= 1 && p <= count && p !== page && onChange) onChange(p);
  };
  const range = (a, b) => {
    const r = [];
    for (let i = a; i <= b; i++) r.push(i);
    return r;
  };
  const left = Math.max(2, page - siblingCount);
  const right = Math.min(count - 1, page + siblingCount);
  const pages = [1];
  if (left > 2) pages.push("start-ellipsis");
  for (const p of range(left, right)) pages.push(p);
  if (right < count - 1) pages.push("end-ellipsis");
  if (count > 1) pages.push(count);
  const Arrow = ({ dir, disabled }) => /* @__PURE__ */ jsx98(
    "button",
    {
      type: "button",
      "aria-label": dir === "prev" ? "previous page" : "next page",
      disabled,
      onClick: () => go(dir === "prev" ? page - 1 : page + 1),
      style: { width: 32, height: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", background: "var(--bw-white)", cursor: disabled ? "not-allowed" : "pointer", color: disabled ? "var(--label-disable)" : "var(--label-neutral)" },
      children: /* @__PURE__ */ jsx98("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx98("path", { d: dir === "prev" ? "m15 18-6-6 6-6" : "m9 18 6-6-6-6" }) })
    }
  );
  return /* @__PURE__ */ jsxs65("nav", { "aria-label": "pagination", style: { display: "inline-flex", alignItems: "center", gap: 4, ...style }, ...rest, children: [
    /* @__PURE__ */ jsx98(Arrow, { dir: "prev", disabled: page <= 1 }),
    pages.map((p, i) => typeof p === "string" ? /* @__PURE__ */ jsx98("span", { style: { minWidth: 20, textAlign: "center", color: "var(--label-assistive)", fontFamily: "var(--font-sans)" }, children: "\u2026" }, p + i) : /* @__PURE__ */ jsx98(
      "button",
      {
        type: "button",
        "aria-current": p === page ? "page" : void 0,
        onClick: () => go(p),
        style: {
          minWidth: 32,
          height: 32,
          padding: "0 6px",
          borderRadius: "var(--radius-md)",
          cursor: "pointer",
          border: `1px solid ${p === page ? "var(--lk-accent-ink)" : "transparent"}`,
          background: p === page ? "var(--lk-accent-tint-2)" : "transparent",
          fontFamily: "var(--font-sans)",
          fontSize: 15,
          fontWeight: "var(--fw-bold)",
          letterSpacing: 0,
          fontVariantNumeric: "tabular-nums",
          color: p === page ? "var(--lk-accent-ink)" : "var(--label-neutral)"
        },
        children: p
      },
      p
    )),
    /* @__PURE__ */ jsx98(Arrow, { dir: "next", disabled: page >= count })
  ] });
}

// components/navigation/SideNav.jsx
import React101 from "react";
import { jsx as jsx99, jsxs as jsxs66 } from "react/jsx-runtime";
var Chevron = ({ open }) => /* @__PURE__ */ jsx99("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" }, children: /* @__PURE__ */ jsx99("path", { d: "M6 9l6 6 6-6" }) });
function SideNav({
  items = [],
  value,
  defaultValue,
  onChange,
  header,
  headerCollapsed,
  footer,
  width = 240,
  collapsible = false,
  collapsed,
  defaultCollapsed = false,
  onCollapsedChange,
  collapsedWidth = 64,
  overlay = false,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const flat = [];
  items.forEach((i) => {
    if (i && !i.heading && i.value != null) {
      flat.push(i);
      (i.children || []).forEach((c) => flat.push(c));
    }
  });
  const [internal, setInternal] = React101.useState(defaultValue != null ? defaultValue : flat[0] && flat[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const colControlled = collapsed !== void 0;
  const [colInternal, setColInternal] = React101.useState(defaultCollapsed || overlay);
  const col = colControlled ? collapsed : colInternal;
  const setCol = (c) => {
    if (!colControlled) setColInternal(c);
    onCollapsedChange && onCollapsedChange(c);
  };
  const navRef = React101.useRef(null);
  const hasPopover = () => !!(navRef.current && navRef.current.querySelector('[role="menu"]'));
  const peekT = React101.useRef(null);
  const peek = (expand) => {
    clearTimeout(peekT.current);
    peekT.current = setTimeout(() => {
      if (!expand && hasPopover()) return;
      setCol(!expand);
    }, expand ? 160 : 480);
  };
  React101.useEffect(() => () => clearTimeout(peekT.current), []);
  React101.useEffect(() => {
    if (!overlay || col) return void 0;
    const down = (e) => {
      if (hasPopover()) return;
      if (navRef.current && !navRef.current.contains(e.target)) setCol(true);
    };
    const key = (e) => {
      if (e.key === "Escape" && !hasPopover()) setCol(true);
    };
    document.addEventListener("mousedown", down);
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("mousedown", down);
      document.removeEventListener("keydown", key);
    };
  });
  const [open, setOpen] = React101.useState(() => {
    const o = {};
    items.forEach((i) => {
      if (i && i.children && i.children.some((c) => c.value === val)) o[i.value] = true;
    });
    return o;
  });
  const [hovKey, setHovKey] = React101.useState(null);
  const hoverProps = (k) => ({ onMouseEnter: () => setHovKey(k), onMouseLeave: () => setHovKey(null) });
  const row = (active, disabled, extra, hovered) => ({
    position: "relative",
    display: "flex",
    alignItems: "center",
    justifyContent: col ? "center" : "flex-start",
    gap: 11,
    width: "100%",
    padding: col ? "11px 0" : "10px 12px",
    border: "none",
    borderRadius: "var(--radius-lg)",
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.45 : 1,
    textAlign: "left",
    fontFamily: "var(--font-sans)",
    background: active ? "var(--lk-accent-tint-2)" : hovered && !disabled ? "var(--lk-accent-tint)" : "transparent",
    color: active ? "var(--lk-accent-ink)" : "var(--label-alternative)",
    transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
    ...extra
  });
  const labelSpan = (active, children) => /* @__PURE__ */ jsx99("span", { style: { flex: 1, minWidth: 0, fontSize: 14, fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children });
  const pill = (active, badge) => /* @__PURE__ */ jsx99("span", { style: { flexShrink: 0, minWidth: 18, height: 18, padding: "0 6px", boxSizing: "border-box", borderRadius: 9, fontSize: 11, fontWeight: "var(--fw-bold)", lineHeight: "18px", textAlign: "center", background: active ? "var(--lk-accent-ink)" : "var(--lk-accent-tint-2)", color: active ? "var(--bw-white)" : "var(--lk-accent-ink)" }, children: badge });
  const dot = /* @__PURE__ */ jsx99("span", { style: { position: "absolute", top: 7, right: 7, width: 7, height: 7, borderRadius: "50%", background: "var(--lk-accent-ink)" } });
  const brand = col ? headerCollapsed != null ? headerCollapsed : header : header;
  const shell = { display: "flex", flexDirection: "column", width: col ? collapsedWidth : width, boxSizing: "border-box", background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-xl)", padding: 10, transition: "width var(--dur-base, 200ms) var(--ease-out), box-shadow var(--dur-base, 200ms) var(--ease-out)" };
  const inner = /* @__PURE__ */ jsxs66(React101.Fragment, { children: [
    (brand != null || collapsible) && /* @__PURE__ */ jsxs66("div", { style: { position: "relative", display: "flex", flexDirection: col ? "column" : "row", alignItems: "center", justifyContent: "center", gap: 6, minHeight: 24, padding: col ? "14px 10px 10px" : "14px 10px 18px" }, children: [
      brand,
      collapsible && /* @__PURE__ */ jsx99(
        "button",
        {
          type: "button",
          onClick: () => setCol(!col),
          title: col ? "\uD3BC\uCE58\uAE30" : "\uC811\uAE30",
          "aria-label": col ? "\uD3BC\uCE58\uAE30" : "\uC811\uAE30",
          style: { position: col ? "static" : "absolute", right: col ? "auto" : 2, top: col ? "auto" : 12, display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, padding: 0, border: "none", borderRadius: 8, background: "transparent", color: "var(--label-assistive)", cursor: "pointer" },
          children: /* @__PURE__ */ jsxs66("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx99("rect", { x: "3", y: "4", width: "18", height: "16", rx: "3" }),
            /* @__PURE__ */ jsx99("path", { d: "M9.5 4v16" }),
            /* @__PURE__ */ jsx99("path", { d: col ? "M13.5 9l3 3-3 3" : "M17 9l-3 3 3 3" })
          ] })
        }
      )
    ] }),
    /* @__PURE__ */ jsx99("div", { style: { display: "flex", flexDirection: "column", gap: 2, overflow: "hidden auto" }, children: items.map((o, i) => {
      if (o.heading) return col ? /* @__PURE__ */ jsx99("div", { style: { height: 1, flexShrink: 0, background: "var(--bw-border)", margin: i === 0 ? "2px 12px 6px" : "10px 12px 6px" } }, "h" + i) : /* @__PURE__ */ jsx99("div", { style: { fontFamily: "var(--font-sans)", fontSize: 10.5, fontWeight: "var(--fw-bold)", letterSpacing: "1px", textTransform: "uppercase", color: "var(--label-assistive)", padding: i === 0 ? "4px 12px 6px" : "14px 12px 6px" }, children: o.heading }, "h" + i);
      const kids = o.children || [];
      const title = typeof o.label === "string" ? o.label : void 0;
      if (kids.length > 0) {
        const isOpen = !!open[o.value];
        const childActive = kids.some((c) => c.value === val);
        const onParent = () => {
          if (col) {
            setCol(false);
            setOpen((s) => ({ ...s, [o.value]: true }));
          } else {
            setOpen((s) => ({ ...s, [o.value]: !s[o.value] }));
          }
        };
        return /* @__PURE__ */ jsxs66(React101.Fragment, { children: [
          /* @__PURE__ */ jsxs66(
            "button",
            {
              type: "button",
              "aria-expanded": col ? void 0 : isOpen,
              disabled: o.disabled,
              onClick: onParent,
              title,
              ...hoverProps(o.value),
              style: row(false, o.disabled, { color: childActive ? "var(--lk-accent-ink)" : "var(--label-alternative)" }, hovKey === o.value),
              children: [
                o.icon != null && /* @__PURE__ */ jsx99("span", { style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
                !col && labelSpan(childActive, o.label),
                !col && /* @__PURE__ */ jsx99(Chevron, { open: isOpen }),
                col && childActive && dot
              ]
            }
          ),
          !col && isOpen && /* @__PURE__ */ jsx99("div", { style: { display: "flex", flexDirection: "column", gap: 2, margin: "0 0 4px" }, children: kids.map((c) => {
            const ca = c.value === val;
            return /* @__PURE__ */ jsxs66(
              "button",
              {
                type: "button",
                "aria-current": ca ? "page" : void 0,
                disabled: c.disabled,
                onClick: () => pick(c.value),
                ...hoverProps(c.value),
                style: row(ca, c.disabled, { padding: "8px 12px 8px 42px" }, hovKey === c.value),
                children: [
                  /* @__PURE__ */ jsx99("span", { style: { flex: 1, minWidth: 0, fontSize: 13.5, fontWeight: ca ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: c.label }),
                  c.badge != null && pill(ca, c.badge)
                ]
              },
              c.value
            );
          }) })
        ] }, o.value);
      }
      const active = o.value === val;
      return /* @__PURE__ */ jsxs66(
        "button",
        {
          type: "button",
          "aria-current": active ? "page" : void 0,
          disabled: o.disabled,
          onClick: () => pick(o.value),
          title,
          ...hoverProps(o.value),
          style: row(active, o.disabled, null, hovKey === o.value),
          children: [
            o.icon != null && /* @__PURE__ */ jsx99("span", { style: { flexShrink: 0, display: "inline-flex" }, children: o.icon }),
            !col && labelSpan(active, o.label),
            !col && o.badge != null && pill(active, o.badge),
            col && o.badge != null && dot
          ]
        },
        o.value
      );
    }) }),
    /* @__PURE__ */ jsx99("div", { style: { marginTop: "auto", paddingTop: 8 }, children: footer != null && /* @__PURE__ */ jsx99("div", { style: { paddingTop: 10, marginLeft: 2, marginRight: 2, borderTop: "1px solid var(--bw-border)" }, children: footer }) })
  ] });
  return /* @__PURE__ */ jsx99(
    "nav",
    {
      ref: navRef,
      onClick: overlay && col ? (e) => {
        if (!e.target.closest("button")) setCol(false);
      } : void 0,
      onMouseEnter: overlay ? () => peek(true) : void 0,
      onMouseLeave: overlay ? () => peek(false) : void 0,
      style: overlay ? { position: "relative", width: collapsedWidth, flexShrink: 0, ...style } : { ...shell, ...style },
      ...rest,
      children: overlay ? /* @__PURE__ */ jsx99("div", { style: { ...shell, position: "absolute", top: 0, left: 0, height: "100%", zIndex: col ? 1 : 40, boxShadow: col ? "none" : "0 16px 48px rgba(14, 19, 41, 0.18)" }, children: inner }) : inner
    }
  );
}

// components/navigation/Steps.jsx
import React102 from "react";
import { jsx as jsx100, jsxs as jsxs67 } from "react/jsx-runtime";
function Steps({ steps = [], current = 0, style, ...rest }) {
  return /* @__PURE__ */ jsx100("div", { style: { display: "flex", alignItems: "flex-start", ...style }, ...rest, children: steps.map((s, i) => {
    const label = typeof s === "string" ? s : s.label;
    const done = i < current;
    const active = i === current;
    const bg = done ? "var(--lk-accent-ink)" : "var(--bw-white)";
    const bd = done || active ? "var(--lk-accent-ink)" : "var(--bw-border)";
    const fg = done ? "#fff" : active ? "var(--lk-accent-ink)" : "var(--label-assistive)";
    return /* @__PURE__ */ jsxs67(React102.Fragment, { children: [
      /* @__PURE__ */ jsxs67("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
        /* @__PURE__ */ jsx100("span", { style: { width: 32, height: 32, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: bg, border: `2px solid ${bd}`, color: fg, fontFamily: "var(--font-sans)", fontSize: 14, fontWeight: "var(--fw-bold)" }, children: done ? /* @__PURE__ */ jsx100("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx100("path", { d: "M20 6 9 17l-5-5" }) }) : i + 1 }),
        /* @__PURE__ */ jsx100("span", { style: { fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", letterSpacing: 0, color: active ? "var(--label-normal)" : "var(--label-alternative)", whiteSpace: "nowrap" }, children: label })
      ] }),
      i < steps.length - 1 && /* @__PURE__ */ jsx100("span", { style: { flex: 1, height: 2, marginTop: 15, background: i < current ? "var(--lk-accent-ink)" : "var(--bw-border)", minWidth: 24 } })
    ] }, i);
  }) });
}

// components/navigation/Tabs.jsx
import React103 from "react";
import { jsx as jsx101, jsxs as jsxs68 } from "react/jsx-runtime";
function Tabs({ items = [], value, defaultValue, onChange, full = false, style, ...rest }) {
  const norm = items.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React103.useState(defaultValue != null ? defaultValue : norm[0] && norm[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  return /* @__PURE__ */ jsx101("div", { role: "tablist", style: { display: "flex", gap: full ? 0 : 24, borderBottom: "1px solid var(--bw-border)", ...style }, ...rest, children: norm.map((o) => {
    const active = o.value === val;
    return /* @__PURE__ */ jsxs68(
      "button",
      {
        type: "button",
        role: "tab",
        "aria-selected": active,
        onClick: () => pick(o.value),
        style: {
          flex: full ? 1 : void 0,
          position: "relative",
          padding: "0 2px 14px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          fontFamily: "var(--font-sans)",
          fontSize: 16,
          fontWeight: active ? "var(--fw-bold)" : "var(--fw-semibold)",
          letterSpacing: 0,
          color: active ? "var(--label-normal)" : "var(--label-alternative)",
          transition: "color var(--dur-fast) var(--ease-out)"
        },
        children: [
          /* @__PURE__ */ jsx101("span", { children: o.label }),
          o.count != null && /* @__PURE__ */ jsx101("span", { style: { fontSize: 13, fontWeight: "var(--fw-bold)", color: active ? "var(--lk-accent-ink)" : "var(--label-assistive)" }, children: o.count }),
          /* @__PURE__ */ jsx101("span", { style: { position: "absolute", left: 0, right: 0, bottom: -1, height: 2.5, borderRadius: "2px 2px 0 0", background: active ? "var(--lk-accent-ink)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" } })
        ]
      },
      o.value
    );
  }) });
}

// components/navigation/Toolbar.jsx
import React104 from "react";
import { jsx as jsx102 } from "react/jsx-runtime";
function Toolbar({ children, style, ...rest }) {
  return /* @__PURE__ */ jsx102("div", { role: "toolbar", style: { display: "inline-flex", alignItems: "center", gap: 6, padding: 6, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", boxShadow: "var(--shadow-xs)", ...style }, ...rest, children });
}

// components/navigation/TopBar.jsx
import React105 from "react";
import { jsx as jsx103, jsxs as jsxs69 } from "react/jsx-runtime";
var TopBarToneContext = React105.createContext("light");
function TopBar({ brand, children, actions, navAlign = "start", sticky = false, bordered = true, dark = false, height = 64, style, ...rest }) {
  const tone = dark ? "dark" : "light";
  return /* @__PURE__ */ jsxs69(
    "header",
    {
      style: {
        position: sticky ? "sticky" : "static",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 20,
        height,
        paddingInline: "clamp(16px, 4vw, 32px)",
        boxSizing: "border-box",
        background: dark ? "linear-gradient(135deg, var(--lk-navy-from), var(--lk-navy-to))" : sticky ? "color-mix(in srgb, var(--surface-card) 88%, transparent)" : "var(--surface-card)",
        color: dark ? "var(--text-on-inverse)" : "var(--text-body)",
        borderBottom: bordered ? `1px solid ${dark ? "rgba(255,255,255,0.10)" : "var(--border-subtle)"}` : "none",
        backdropFilter: sticky ? "saturate(150%) blur(8px)" : "none",
        WebkitBackdropFilter: sticky ? "saturate(150%) blur(8px)" : "none",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        brand != null && /* @__PURE__ */ jsx103("div", { style: { display: "flex", alignItems: "center", flexShrink: 0 }, children: brand }),
        children != null ? /* @__PURE__ */ jsx103(TopBarToneContext.Provider, { value: tone, children: /* @__PURE__ */ jsx103("nav", { style: { display: "flex", alignItems: "center", alignSelf: "stretch", gap: 4, flex: 1, minWidth: 0, justifyContent: navAlign === "center" ? "center" : "flex-start" }, children }) }) : /* @__PURE__ */ jsx103("div", { style: { flex: 1 } }),
        actions != null && /* @__PURE__ */ jsx103("div", { style: { display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }, children: actions })
      ]
    }
  );
}
function TopBarNavItem({ children, active = false, href, menuItems, menuTheme = "light", style, onClick, ...rest }) {
  const tone = React105.useContext(TopBarToneContext);
  const onDark = tone === "dark";
  const [hover, setHover] = React105.useState(false);
  const [focusWithin, setFocusWithin] = React105.useState(false);
  const [clickOpen, setClickOpen] = React105.useState(false);
  const hasMenu = !!menuItems?.length;
  const open = hasMenu && (hover || focusWithin || clickOpen);
  const activeOrHover = active || hover || focusWithin || clickOpen;
  const Comp = href ? "a" : "button";
  const fg = active ? onDark ? "#fff" : "var(--lk-accent-ink)" : activeOrHover ? onDark ? "#fff" : "var(--label-strong)" : onDark ? "rgba(255,255,255,0.66)" : "var(--label-alternative)";
  return /* @__PURE__ */ jsxs69(
    "span",
    {
      style: { position: "relative", display: "inline-flex", alignSelf: "stretch", ...style },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      onFocus: () => setFocusWithin(true),
      onBlur: (event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) {
          setFocusWithin(false);
          setClickOpen(false);
        }
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsxs69(
          Comp,
          {
            href,
            type: href ? void 0 : "button",
            "aria-current": active ? "page" : void 0,
            "aria-haspopup": hasMenu ? "menu" : void 0,
            "aria-expanded": hasMenu ? open : void 0,
            onClick: (event) => {
              if (hasMenu) {
                event.preventDefault();
                setClickOpen((value) => !value);
              }
              onClick && onClick(event);
            },
            onFocus: () => setFocusWithin(true),
            onBlur: (event) => {
              if (!event.currentTarget.parentElement?.contains(event.relatedTarget)) {
                setFocusWithin(false);
                setClickOpen(false);
              }
            },
            style: {
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              alignSelf: "stretch",
              padding: "0 14px",
              border: "none",
              background: "transparent",
              color: fg,
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: 14.5,
              fontWeight: 700,
              letterSpacing: 0,
              textDecoration: "none",
              whiteSpace: "nowrap",
              transition: "color var(--dur-fast) var(--ease-out)"
            },
            children: [
              children,
              /* @__PURE__ */ jsx103(
                "span",
                {
                  "aria-hidden": "true",
                  style: {
                    position: "absolute",
                    left: 14,
                    right: 14,
                    bottom: 0,
                    height: 2.5,
                    borderRadius: "2px 2px 0 0",
                    background: onDark ? "var(--lk-accent)" : "var(--lk-accent-ink)",
                    transform: activeOrHover ? "scaleX(1)" : "scaleX(0)",
                    transformOrigin: "center",
                    transition: "transform var(--dur-fast) var(--ease-out)"
                  }
                }
              )
            ]
          }
        ),
        menuItems?.length ? /* @__PURE__ */ jsx103(
          "div",
          {
            role: "menu",
            "data-theme": menuTheme,
            className: `theme-${menuTheme}`,
            style: {
              position: "absolute",
              top: "100%",
              left: "50%",
              zIndex: 60,
              minWidth: 176,
              display: "flex",
              flexDirection: "column",
              gap: 2,
              padding: 8,
              background: "var(--surface-card)",
              border: "1px solid var(--line-normal)",
              borderRadius: 14,
              boxShadow: "var(--shadow-md)",
              opacity: open ? 1 : 0,
              visibility: open ? "visible" : "hidden",
              transform: open ? "translate(-50%, 0)" : "translate(-50%, 4px)",
              transition: "opacity var(--dur-fast) var(--ease-out), transform var(--dur-fast) var(--ease-out), visibility 0s linear"
            },
            children: menuItems.map((item) => {
              const ItemComp = item.href ? "a" : "button";
              return /* @__PURE__ */ jsx103(
                ItemComp,
                {
                  href: item.href,
                  type: item.href ? void 0 : "button",
                  role: "menuitem",
                  onClick: item.onClick,
                  style: {
                    display: "block",
                    width: "100%",
                    padding: "10px 12px",
                    border: "none",
                    borderRadius: 10,
                    background: "transparent",
                    color: "var(--label-normal)",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                    fontSize: 14,
                    fontWeight: 600,
                    textAlign: "left",
                    textDecoration: "none"
                  },
                  onMouseEnter: (event) => {
                    event.currentTarget.style.background = "var(--bw-mist)";
                  },
                  onMouseLeave: (event) => {
                    event.currentTarget.style.background = "transparent";
                  },
                  children: item.label
                },
                item.label
              );
            })
          }
        ) : null
      ]
    }
  );
}

// components/navigation/UserMenu.jsx
import React106 from "react";
import { jsx as jsx104, jsxs as jsxs70 } from "react/jsx-runtime";
function UserMenu({ name, detail, src, status, items = [], collapsed = false, style, ...rest }) {
  const [open, setOpen] = React106.useState(false);
  const [hov, setHov] = React106.useState(-1);
  const ref = React106.useRef(null);
  React106.useEffect(() => {
    if (!open) return void 0;
    const h = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    const k = (e) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", h);
    document.addEventListener("keydown", k);
    return () => {
      document.removeEventListener("mousedown", h);
      document.removeEventListener("keydown", k);
    };
  }, [open]);
  return /* @__PURE__ */ jsxs70("div", { ref, style: { position: "relative", ...style }, ...rest, children: [
    open && /* @__PURE__ */ jsx104("div", { role: "menu", style: { position: "absolute", bottom: "calc(100% + 8px)", left: 0, minWidth: collapsed ? 200 : "100%", boxSizing: "border-box", background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", padding: 5, boxShadow: "0 12px 32px rgba(14, 19, 41, 0.12)", zIndex: 30 }, children: items.map((it, i) => it.divider ? /* @__PURE__ */ jsx104("div", { style: { height: 1, background: "var(--bw-border)", margin: "5px 4px" } }, "d" + i) : /* @__PURE__ */ jsxs70(
      "button",
      {
        type: "button",
        role: "menuitem",
        disabled: it.disabled,
        onClick: () => {
          setOpen(false);
          it.onClick && it.onClick();
        },
        onMouseEnter: () => setHov(i),
        onMouseLeave: () => setHov(-1),
        style: { display: "flex", alignItems: "center", gap: 9, width: "100%", padding: "8px 10px", border: "none", borderRadius: 8, cursor: it.disabled ? "not-allowed" : "pointer", opacity: it.disabled ? 0.45 : 1, textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 13.5, fontWeight: "var(--fw-medium)", letterSpacing: 0, background: hov === i && !it.disabled ? "var(--lk-accent-tint)" : "transparent", color: it.danger ? "var(--status-danger, #CF6360)" : "var(--label-normal, #0E1329)", transition: "background var(--dur-fast) var(--ease-out)" },
        children: [
          it.icon != null && /* @__PURE__ */ jsx104("span", { style: { flexShrink: 0, display: "inline-flex", color: it.danger ? "inherit" : "var(--label-alternative)" }, children: it.icon }),
          /* @__PURE__ */ jsx104("span", { style: { flex: 1, minWidth: 0 }, children: it.label })
        ]
      },
      i
    )) }),
    /* @__PURE__ */ jsxs70(
      "button",
      {
        type: "button",
        "aria-haspopup": "menu",
        "aria-expanded": open,
        title: collapsed && typeof name === "string" ? name : void 0,
        onClick: () => setOpen(!open),
        style: { display: "flex", alignItems: "center", justifyContent: collapsed ? "center" : "flex-start", gap: 10, width: "100%", padding: collapsed ? "6px 0" : "6px 8px", boxSizing: "border-box", border: "none", borderRadius: "var(--radius-lg)", cursor: "pointer", textAlign: "left", fontFamily: "var(--font-sans)", background: open ? "var(--lk-accent-tint)" : "transparent", transition: "background var(--dur-fast) var(--ease-out)" },
        children: [
          /* @__PURE__ */ jsx104(Avatar, { name: typeof name === "string" ? name : void 0, src, status, size: 30, style: { flexShrink: 0 } }),
          !collapsed && /* @__PURE__ */ jsxs70("span", { style: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 1 }, children: [
            /* @__PURE__ */ jsx104("span", { style: { fontSize: 13, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal, #0E1329)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: name }),
            detail != null && /* @__PURE__ */ jsx104("span", { style: { fontSize: 11.5, color: "var(--label-assistive)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: detail })
          ] }),
          !collapsed && /* @__PURE__ */ jsx104("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-assistive)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", style: { flexShrink: 0, transform: open ? "rotate(180deg)" : "none", transition: "transform var(--dur-fast) var(--ease-out)" }, children: /* @__PURE__ */ jsx104("path", { d: "M6 15l6-6 6 6" }) })
        ]
      }
    )
  ] });
}

// components/navigation/Wizard.jsx
import React107 from "react";
import { jsx as jsx105, jsxs as jsxs71 } from "react/jsx-runtime";
function Wizard({ steps = [], current, defaultCurrent = 0, onStepChange, children, footer, style, ...rest }) {
  const isControlled = current !== void 0;
  const [internal, setInternal] = React107.useState(defaultCurrent);
  const cur = isControlled ? current : internal;
  const go = (n) => {
    const c = Math.max(0, Math.min(steps.length - 1, n));
    if (!isControlled) setInternal(c);
    onStepChange && onStepChange(c);
  };
  return /* @__PURE__ */ jsxs71("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx105("div", { style: { display: "flex", alignItems: "flex-start", marginBottom: 28 }, children: steps.map((s, i) => {
      const label = typeof s === "string" ? s : s.label;
      const done = i < cur;
      const active = i === cur;
      return /* @__PURE__ */ jsxs71(React107.Fragment, { children: [
        /* @__PURE__ */ jsxs71("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flexShrink: 0 }, children: [
          /* @__PURE__ */ jsx105("span", { style: { width: 32, height: 32, borderRadius: "50%", display: "inline-flex", alignItems: "center", justifyContent: "center", background: done ? "var(--lk-accent-ink)" : "var(--bw-white)", border: `2px solid ${done || active ? "var(--lk-accent-ink)" : "var(--bw-border)"}`, color: done ? "#fff" : active ? "var(--lk-accent-ink)" : "var(--label-assistive)", fontSize: 14, fontWeight: "var(--fw-bold)" }, children: done ? /* @__PURE__ */ jsx105("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx105("path", { d: "M20 6 9 17l-5-5" }) }) : i + 1 }),
          /* @__PURE__ */ jsx105("span", { style: { fontSize: 13, fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)", color: active ? "var(--label-normal)" : "var(--label-alternative)", whiteSpace: "nowrap" }, children: label })
        ] }),
        i < steps.length - 1 && /* @__PURE__ */ jsx105("span", { style: { flex: 1, height: 2, marginTop: 15, background: i < cur ? "var(--lk-accent-ink)" : "var(--bw-border)", minWidth: 24 } })
      ] }, i);
    }) }),
    /* @__PURE__ */ jsx105("div", { children: typeof children === "function" ? children(cur) : children }),
    footer !== null && /* @__PURE__ */ jsxs71("div", { style: { display: "flex", justifyContent: "space-between", marginTop: 24 }, children: [
      /* @__PURE__ */ jsx105("button", { type: "button", onClick: () => go(cur - 1), disabled: cur === 0, style: { height: 44, padding: "0 18px", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", background: "var(--bw-white)", color: "var(--label-normal)", cursor: cur === 0 ? "not-allowed" : "pointer", opacity: cur === 0 ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-bold)" }, children: "\uC774\uC804" }),
      /* @__PURE__ */ jsx105("button", { type: "button", onClick: () => go(cur + 1), disabled: cur === steps.length - 1, style: { height: 44, padding: "0 20px", border: "none", borderRadius: "var(--radius-md)", background: "var(--lk-accent-ink)", color: "#fff", cursor: cur === steps.length - 1 ? "not-allowed" : "pointer", opacity: cur === steps.length - 1 ? 0.5 : 1, fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-bold)" }, children: "\uB2E4\uC74C" })
    ] })
  ] });
}

// components/overlay/Alert.jsx
import React108 from "react";
import { jsx as jsx106, jsxs as jsxs72 } from "react/jsx-runtime";
function Alert({
  open = false,
  title,
  children,
  tone = "default",
  confirmLabel = "\uD655\uC778",
  cancelLabel,
  onConfirm,
  onCancel,
  onClose,
  actions,
  closeOnScrim = true,
  style,
  ...rest
}) {
  const dismiss = onClose || onCancel;
  React108.useEffect(() => {
    if (!open) return void 0;
    const onKey = (e) => {
      if (e.key === "Escape" && dismiss) dismiss();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, dismiss]);
  if (!open) return null;
  const accent = tone === "danger" ? "var(--bw-red)" : "var(--color-primary)";
  const confirmStyle = { height: 44, padding: "0 20px", border: "none", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "#fff", background: accent };
  const cancelStyle = { height: 44, padding: "0 20px", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-md)", cursor: "pointer", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)", background: "var(--bw-white)" };
  return /* @__PURE__ */ jsx106(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && dismiss) dismiss();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--scrim-dark)", backdropFilter: "blur(2px)" },
      children: /* @__PURE__ */ jsxs72(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : void 0,
          style: { width: "100%", maxWidth: 420, background: "var(--bw-white)", borderRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-xl)", padding: "28px 28px 24px", fontFamily: "var(--font-sans)", ...style },
          ...rest,
          children: [
            title != null && /* @__PURE__ */ jsx106("div", { style: { fontSize: 20, fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--label-normal)", marginBottom: 10 }, children: title }),
            children != null && /* @__PURE__ */ jsx106("div", { style: { fontSize: 15, lineHeight: 1.7, color: "var(--label-neutral)", wordBreak: "keep-all" }, children }),
            /* @__PURE__ */ jsx106("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, marginTop: 24 }, children: actions != null ? actions : /* @__PURE__ */ jsxs72(React108.Fragment, { children: [
              cancelLabel && /* @__PURE__ */ jsx106("button", { type: "button", style: cancelStyle, onClick: onCancel || dismiss, children: cancelLabel }),
              /* @__PURE__ */ jsx106("button", { type: "button", style: confirmStyle, onClick: onConfirm || dismiss, children: confirmLabel })
            ] }) })
          ]
        }
      )
    }
  );
}

// components/overlay/CommandPalette.jsx
import React109 from "react";
import { jsx as jsx107, jsxs as jsxs73 } from "react/jsx-runtime";
function CommandPalette({ open = false, onClose, commands = [], placeholder = "\uBA85\uB839 \uAC80\uC0C9\u2026", style, ...rest }) {
  const [q, setQ] = React109.useState("");
  React109.useEffect(() => {
    if (!open) return void 0;
    setQ("");
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const filtered = q ? commands.filter((c) => String(c.label).toLowerCase().includes(q.toLowerCase())) : commands;
  return /* @__PURE__ */ jsx107("div", { role: "presentation", onClick: (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  }, style: { position: "fixed", inset: 0, zIndex: 110, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: "12vh", background: "var(--scrim-dark)", backdropFilter: "blur(2px)" }, children: /* @__PURE__ */ jsxs73("div", { role: "dialog", "aria-modal": "true", style: { width: "100%", maxWidth: 560, background: "var(--bw-white)", borderRadius: "var(--radius-2xl)", boxShadow: "var(--shadow-xl)", overflow: "hidden", fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs73("div", { style: { display: "flex", alignItems: "center", gap: 12, padding: "16px 20px", borderBottom: "1px solid var(--bw-border)" }, children: [
      /* @__PURE__ */ jsxs73("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "var(--label-assistive)", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx107("circle", { cx: "11", cy: "11", r: "7" }),
        /* @__PURE__ */ jsx107("path", { d: "m21 21-4.3-4.3" })
      ] }),
      /* @__PURE__ */ jsx107("input", { autoFocus: true, value: q, onChange: (e) => setQ(e.target.value), placeholder, "aria-label": typeof placeholder === "string" ? placeholder : "\uBA85\uB839 \uAC80\uC0C9", style: { flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: "var(--font-sans)", fontSize: 17, color: "var(--label-normal)" } })
    ] }),
    /* @__PURE__ */ jsx107("div", { style: { maxHeight: 340, overflowY: "auto", padding: 8 }, children: filtered.length === 0 ? /* @__PURE__ */ jsx107("div", { style: { padding: 28, textAlign: "center", color: "var(--label-alternative)", fontSize: 14 }, children: "\uACB0\uACFC \uC5C6\uC74C" }) : filtered.map((c, i) => /* @__PURE__ */ jsxs73(
      "button",
      {
        type: "button",
        onClick: () => {
          if (onClose) onClose();
          c.onSelect && c.onSelect();
        },
        onMouseEnter: (e) => {
          e.currentTarget.style.background = "var(--fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: { width: "100%", display: "flex", alignItems: "center", gap: 12, padding: "11px 12px", border: "none", background: "transparent", cursor: "pointer", borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 15, fontWeight: "var(--fw-medium)", color: "var(--label-normal)" },
        children: [
          c.icon && /* @__PURE__ */ jsx107("span", { style: { color: "var(--lk-accent-ink)", display: "inline-flex" }, children: c.icon }),
          /* @__PURE__ */ jsx107("span", { style: { flex: 1 }, children: c.label }),
          c.shortcut && /* @__PURE__ */ jsx107("span", { style: { fontSize: 12, color: "var(--label-assistive)", fontWeight: "var(--fw-semibold)" }, children: c.shortcut })
        ]
      },
      i
    )) })
  ] }) });
}

// components/overlay/Dimmer.jsx
import React110 from "react";
import { jsx as jsx108 } from "react/jsx-runtime";
function Dimmer({ open = false, children, onClick, blur = false, style, ...rest }) {
  if (!open) return null;
  return /* @__PURE__ */ jsx108(
    "div",
    {
      onClick,
      style: {
        position: "absolute",
        inset: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--scrim-dark)",
        color: "var(--text-on-inverse)",
        backdropFilter: blur ? "blur(3px)" : "none",
        borderRadius: "inherit",
        ...style
      },
      ...rest,
      children
    }
  );
}

// components/overlay/Drawer.jsx
import React111 from "react";
import { jsx as jsx109, jsxs as jsxs74 } from "react/jsx-runtime";
function Drawer({ open = false, side = "right", width = 380, title, children, footer, onClose, closeOnScrim = true, style, ...rest }) {
  const [shown, setShown] = React111.useState(false);
  React111.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    return void 0;
  }, [open]);
  React111.useEffect(() => {
    if (!open) return void 0;
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  const isRight = side === "right";
  const hidden = isRight ? "translateX(100%)" : "translateX(-100%)";
  return /* @__PURE__ */ jsx109(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: 100, background: "var(--scrim-dark)", backdropFilter: "blur(2px)", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" },
      children: /* @__PURE__ */ jsxs74(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : void 0,
          style: { position: "absolute", top: 0, bottom: 0, [isRight ? "right" : "left"]: 0, width, maxWidth: "92vw", display: "flex", flexDirection: "column", background: "var(--bw-white)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : hidden, transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          children: [
            (title != null || onClose) && /* @__PURE__ */ jsxs74("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 22px", borderBottom: "1px solid var(--bw-border)" }, children: [
              /* @__PURE__ */ jsx109("div", { style: { flex: 1, minWidth: 0, fontSize: 18, fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--label-normal)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
              onClose && /* @__PURE__ */ jsx109("button", { type: "button", "aria-label": "close", onClick: onClose, style: { display: "inline-flex", padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--label-assistive)" }, children: /* @__PURE__ */ jsx109("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx109("path", { d: "M18 6 6 18M6 6l12 12" }) }) })
            ] }),
            /* @__PURE__ */ jsx109("div", { style: { flex: 1, padding: "20px 22px", overflow: "auto", fontSize: 15, lineHeight: 1.7, color: "var(--label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ jsx109("div", { style: { padding: "16px 22px", borderTop: "1px solid var(--bw-border)", display: "flex", justifyContent: "flex-end", gap: 10 }, children: footer })
          ]
        }
      )
    }
  );
}

// components/overlay/DropdownMenu.jsx
import React112 from "react";
import { jsx as jsx110, jsxs as jsxs75 } from "react/jsx-runtime";
function DropdownMenu({ trigger, items = [], align = "left", style, ...rest }) {
  const [open, setOpen] = React112.useState(false);
  const ref = React112.useRef(null);
  React112.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return /* @__PURE__ */ jsxs75("div", { ref, style: { position: "relative", display: "inline-block", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx110("span", { onClick: () => setOpen((o) => !o), style: { display: "inline-flex" }, children: trigger }),
    open && /* @__PURE__ */ jsx110("div", { role: "menu", style: { position: "absolute", top: "calc(100% + 8px)", [align]: 0, zIndex: 40, minWidth: 184, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 6 }, children: items.map((it, i) => it.divider ? /* @__PURE__ */ jsx110("div", { style: { height: 1, background: "var(--bw-border)", margin: "6px 4px" } }, i) : /* @__PURE__ */ jsxs75(
      "button",
      {
        type: "button",
        role: "menuitem",
        disabled: it.disabled,
        onClick: () => {
          setOpen(false);
          it.onClick && it.onClick();
        },
        onMouseEnter: (e) => {
          if (!it.disabled) e.currentTarget.style.background = "var(--fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: { width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "9px 12px", border: "none", background: "transparent", cursor: it.disabled ? "not-allowed" : "pointer", borderRadius: "var(--radius-md)", textAlign: "left", fontFamily: "var(--font-sans)", fontSize: 14.5, fontWeight: "var(--fw-medium)", letterSpacing: 0, color: it.danger ? "var(--bw-red)" : "var(--label-normal)", opacity: it.disabled ? 0.5 : 1 },
        children: [
          it.icon,
          /* @__PURE__ */ jsx110("span", { children: it.label })
        ]
      },
      i
    )) })
  ] });
}

// components/overlay/HoverCard.jsx
import React113 from "react";
import { jsx as jsx111, jsxs as jsxs76 } from "react/jsx-runtime";
function HoverCard({ trigger, children, align = "left", width = 280, style, ...rest }) {
  const [open, setOpen] = React113.useState(false);
  const t = React113.useRef(null);
  const show = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(true), 120);
  };
  const hide = () => {
    clearTimeout(t.current);
    t.current = setTimeout(() => setOpen(false), 120);
  };
  return /* @__PURE__ */ jsxs76("span", { style: { position: "relative", display: "inline-flex" }, onMouseEnter: show, onMouseLeave: hide, ...rest, children: [
    trigger,
    open && /* @__PURE__ */ jsx111("div", { style: { position: "absolute", top: "calc(100% + 8px)", [align]: 0, zIndex: 40, width, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 16, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "var(--label-neutral)", ...style }, children })
  ] });
}

// components/overlay/Lightbox.jsx
import React114 from "react";
import { jsx as jsx112, jsxs as jsxs77 } from "react/jsx-runtime";
function lbArrow(side) {
  return { position: "absolute", [side]: 12, top: "50%", transform: "translateY(-50%)", width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.42)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" };
}
function Lightbox({ open = false, images = [], index = 0, onClose, onIndexChange, style, ...rest }) {
  const [i, setI] = React114.useState(index);
  React114.useEffect(() => {
    setI(index);
  }, [index]);
  const go = React114.useCallback((d) => {
    setI((prev) => {
      const n = (prev + d + images.length) % images.length;
      onIndexChange && onIndexChange(n);
      return n;
    });
  }, [images.length, onIndexChange]);
  React114.useEffect(() => {
    if (!open) return void 0;
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose, go]);
  if (!open) return null;
  const src = images[i];
  const url = typeof src === "string" ? src : src && src.src;
  return /* @__PURE__ */ jsx112(LightboxStage, { url, alt: src && src.alt || "", count: images.length, go, onClose, style, rest }, "stage");
}
function LightboxStage({ url, alt, count, go, onClose, style, rest }) {
  const [loaded, setLoaded] = React114.useState(false);
  const imgRef = React114.useRef(null);
  React114.useEffect(() => {
    setLoaded(false);
    const el = imgRef.current;
    if (el && el.complete && el.naturalWidth > 0) setLoaded(true);
  }, [url]);
  return /* @__PURE__ */ jsxs77("div", { role: "dialog", "aria-modal": "true", onClick: (e) => {
    if (e.target === e.currentTarget && onClose) onClose();
  }, style: { position: "fixed", inset: 0, zIndex: 130, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(8,11,28,0.92)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx112("button", { type: "button", "aria-label": "close", onClick: onClose, style: { position: "absolute", top: 20, right: 20, width: 44, height: 44, borderRadius: "50%", border: "none", background: "rgba(255,255,255,0.12)", color: "#fff", cursor: "pointer", display: "inline-flex", alignItems: "center", justifyContent: "center" }, children: /* @__PURE__ */ jsx112("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx112("path", { d: "M18 6 6 18M6 6l12 12" }) }) }),
    /* @__PURE__ */ jsxs77("div", { style: { position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: loaded ? 0 : 280, minHeight: loaded ? 0 : 200 }, children: [
      /* @__PURE__ */ jsx112("img", { ref: imgRef, src: url, alt, onLoad: () => setLoaded(true), style: { display: "block", maxWidth: "86vw", maxHeight: "86vh", borderRadius: "var(--radius-lg)", boxShadow: loaded ? "var(--shadow-xl)" : "none", opacity: loaded ? 1 : 0, transition: "opacity .18s ease" } }),
      !loaded && /* @__PURE__ */ jsx112("span", { "aria-hidden": "true", style: { position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", display: "inline-flex" }, children: /* @__PURE__ */ jsx112("svg", { width: "34", height: "34", viewBox: "0 0 24 24", fill: "none", stroke: "rgba(255,255,255,0.75)", strokeWidth: "2.4", strokeLinecap: "round", children: /* @__PURE__ */ jsx112("path", { d: "M12 2a10 10 0 1 0 10 10", children: /* @__PURE__ */ jsx112("animateTransform", { attributeName: "transform", type: "rotate", from: "0 12 12", to: "360 12 12", dur: "0.8s", repeatCount: "indefinite" }) }) }) }),
      loaded && count > 1 && /* @__PURE__ */ jsx112("button", { type: "button", "aria-label": "previous", onClick: () => go(-1), style: lbArrow("left"), children: /* @__PURE__ */ jsx112("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx112("path", { d: "m15 18-6-6 6-6" }) }) }),
      loaded && count > 1 && /* @__PURE__ */ jsx112("button", { type: "button", "aria-label": "next", onClick: () => go(1), style: lbArrow("right"), children: /* @__PURE__ */ jsx112("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx112("path", { d: "m9 18 6-6-6-6" }) }) })
    ] })
  ] });
}

// components/overlay/Modal.jsx
import React115 from "react";
import { jsx as jsx113, jsxs as jsxs78 } from "react/jsx-runtime";
function Modal({ open = false, title, children, footer, onClose, width = 520, closeOnScrim = true, style, ...rest }) {
  React115.useEffect(() => {
    if (!open) return void 0;
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsx113(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: 24, background: "var(--scrim-dark)", backdropFilter: "blur(2px)" },
      children: /* @__PURE__ */ jsxs78(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : void 0,
          style: { width: "100%", maxWidth: width, maxHeight: "86vh", display: "flex", flexDirection: "column", background: "var(--bw-white)", borderRadius: "var(--radius-4xl)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", overflow: "hidden", ...style },
          ...rest,
          children: [
            (title != null || onClose) && /* @__PURE__ */ jsxs78("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "20px 24px", borderBottom: "1px solid var(--bw-border)" }, children: [
              /* @__PURE__ */ jsx113("div", { style: { fontSize: 18, fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--label-normal)" }, children: title }),
              onClose && /* @__PURE__ */ jsx113("button", { type: "button", "aria-label": "close", onClick: onClose, style: { display: "inline-flex", padding: 4, border: "none", background: "transparent", cursor: "pointer", color: "var(--label-assistive)" }, children: /* @__PURE__ */ jsx113("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx113("path", { d: "M18 6 6 18M6 6l12 12" }) }) })
            ] }),
            /* @__PURE__ */ jsx113("div", { style: { padding: "20px 24px", overflow: "auto", fontSize: 15, lineHeight: 1.7, color: "var(--label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ jsx113("div", { style: { display: "flex", justifyContent: "flex-end", gap: 10, padding: "16px 24px", borderTop: "1px solid var(--bw-border)" }, children: footer })
          ]
        }
      )
    }
  );
}

// components/overlay/Popover.jsx
import React116 from "react";
import { jsx as jsx114, jsxs as jsxs79 } from "react/jsx-runtime";
function Popover({ trigger, children, align = "left", width = 260, style, ...rest }) {
  const [open, setOpen] = React116.useState(false);
  const ref = React116.useRef(null);
  React116.useEffect(() => {
    if (!open) return void 0;
    const onDoc = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);
  return /* @__PURE__ */ jsxs79("div", { ref, style: { position: "relative", display: "inline-block", ...style }, ...rest, children: [
    /* @__PURE__ */ jsx114("span", { onClick: () => setOpen((o) => !o), style: { display: "inline-flex" }, children: trigger }),
    open && /* @__PURE__ */ jsx114("div", { role: "dialog", style: { position: "absolute", top: "calc(100% + 8px)", [align]: 0, zIndex: 40, width, background: "var(--bw-white)", border: "1px solid var(--bw-border)", borderRadius: "var(--radius-lg)", boxShadow: "var(--shadow-md)", padding: 16, fontFamily: "var(--font-sans)", fontSize: 14, lineHeight: 1.6, color: "var(--label-neutral)" }, children })
  ] });
}

// components/overlay/Sheet.jsx
import React117 from "react";
import { jsx as jsx115, jsxs as jsxs80 } from "react/jsx-runtime";
function Sheet({ open = false, title, children, footer, onClose, closeOnScrim = true, height, style, ...rest }) {
  const [shown, setShown] = React117.useState(false);
  React117.useEffect(() => {
    if (open) {
      const id = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(id);
    }
    setShown(false);
    return void 0;
  }, [open]);
  React117.useEffect(() => {
    if (!open) return void 0;
    const onKey = (e) => {
      if (e.key === "Escape" && onClose) onClose();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);
  if (!open) return null;
  return /* @__PURE__ */ jsx115(
    "div",
    {
      role: "presentation",
      onClick: closeOnScrim ? (e) => {
        if (e.target === e.currentTarget && onClose) onClose();
      } : void 0,
      style: { position: "fixed", inset: 0, zIndex: 100, background: "var(--scrim-dark)", backdropFilter: "blur(2px)", opacity: shown ? 1 : 0, transition: "opacity var(--dur-base) var(--ease-out)" },
      children: /* @__PURE__ */ jsxs80(
        "div",
        {
          role: "dialog",
          "aria-modal": "true",
          "aria-label": typeof title === "string" ? title : void 0,
          style: { position: "absolute", left: 0, right: 0, bottom: 0, maxHeight: "88vh", height, display: "flex", flexDirection: "column", background: "var(--bw-white)", borderTopLeftRadius: "var(--radius-3xl)", borderTopRightRadius: "var(--radius-3xl)", boxShadow: "var(--shadow-xl)", fontFamily: "var(--font-sans)", transform: shown ? "none" : "translateY(100%)", transition: "transform var(--dur-slow) var(--ease-out)", ...style },
          ...rest,
          children: [
            /* @__PURE__ */ jsx115("div", { style: { display: "flex", justifyContent: "center", paddingTop: 10 }, children: /* @__PURE__ */ jsx115("span", { style: { width: 40, height: 4, borderRadius: "var(--radius-pill)", background: "var(--bw-gray-300)" } }) }),
            title != null && /* @__PURE__ */ jsx115("div", { style: { padding: "14px 22px 4px", fontSize: 18, fontWeight: "var(--fw-extra)", letterSpacing: 0, color: "var(--label-normal)" }, children: title }),
            /* @__PURE__ */ jsx115("div", { style: { flex: 1, padding: "14px 22px", overflow: "auto", fontSize: 15, lineHeight: 1.7, color: "var(--label-neutral)", wordBreak: "keep-all" }, children }),
            footer != null && /* @__PURE__ */ jsx115("div", { style: { padding: "14px 22px 22px", display: "flex", gap: 10 }, children: footer })
          ]
        }
      )
    }
  );
}

// components/overlay/Toast.jsx
import React118 from "react";
import { jsx as jsx116, jsxs as jsxs81 } from "react/jsx-runtime";
var TT = {
  info: { c: "var(--lk-accent-ink)", d: '<circle cx="12" cy="12" r="9"/><path d="M12 11.5v5"/><path d="M12 8h.01"/>' },
  success: { c: "var(--bw-green)", d: '<circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.6 2.6 4.6-5.2"/>' },
  warning: { c: "var(--bw-amber)", d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' },
  error: { c: "var(--bw-red)", d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' }
};
function Toast({ tone = "info", children, action, onClose, style, ...rest }) {
  const t = TT[tone] || TT.info;
  return /* @__PURE__ */ jsxs81(
    "div",
    {
      role: "status",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        maxWidth: 440,
        padding: "13px 16px",
        background: "var(--surface-card)",
        color: "var(--label-normal)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-lg)",
        boxShadow: "var(--shadow-lg)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx116("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: t.c, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0 }, dangerouslySetInnerHTML: { __html: t.d } }),
        /* @__PURE__ */ jsx116("span", { style: { flex: 1, fontSize: 14, lineHeight: 1.5, letterSpacing: 0, color: "var(--label-neutral)", wordBreak: "keep-all" }, children }),
        action != null && /* @__PURE__ */ jsx116("span", { style: { flexShrink: 0, color: "var(--accent-text)", fontSize: 14, fontWeight: "var(--fw-bold)", cursor: "pointer" }, children: action }),
        onClose && /* @__PURE__ */ jsx116("button", { type: "button", "aria-label": "close", onClick: onClose, style: { flexShrink: 0, display: "inline-flex", padding: 2, border: "none", background: "transparent", cursor: "pointer", color: "var(--label-assistive)" }, children: /* @__PURE__ */ jsx116("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx116("path", { d: "M18 6 6 18M6 6l12 12" }) }) })
      ]
    }
  );
}

// components/overlay/ToastStack.jsx
import React119 from "react";
import { jsx as jsx117 } from "react/jsx-runtime";
function ToastStack({ children, position = "bottom-right", gap = 10, style, ...rest }) {
  const pos = {
    "bottom-right": { bottom: 20, right: 20, alignItems: "flex-end" },
    "bottom-left": { bottom: 20, left: 20, alignItems: "flex-start" },
    "top-right": { top: 20, right: 20, alignItems: "flex-end" },
    "top-left": { top: 20, left: 20, alignItems: "flex-start" },
    "bottom-center": { bottom: 20, left: "50%", transform: "translateX(-50%)", alignItems: "center" }
  }[position] || {};
  return /* @__PURE__ */ jsx117("div", { style: { position: "fixed", zIndex: 120, display: "flex", flexDirection: "column", gap, ...pos, ...style }, ...rest, children });
}

// components/robotics/ConnectionBadge.jsx
import React120 from "react";
import { jsx as jsx118, jsxs as jsxs82 } from "react/jsx-runtime";
var CFG = {
  online: { c: "var(--bw-green)", bars: 3, label: "\uC628\uB77C\uC778" },
  reconnecting: { c: "var(--bw-amber)", bars: 2, label: "\uC7AC\uC5F0\uACB0" },
  weak: { c: "var(--bw-amber)", bars: 1, label: "\uC57D\uD568" },
  offline: { c: "var(--bw-gray-300)", bars: 0, label: "\uC624\uD504\uB77C\uC778" }
};
function ConnectionBadge({ status = "online", label, showLabel = true, size = "md", style, ...rest }) {
  React120.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-conn-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-conn-kf";
    el.textContent = "@keyframes lk-conn-blink{0%,100%{opacity:1}50%{opacity:.35}}";
    document.head.appendChild(el);
  }, []);
  const cfg = CFG[status] || CFG.online;
  const h = size === "sm" ? 11 : 14;
  const bw = size === "sm" ? 3 : 4;
  return /* @__PURE__ */ jsxs82("span", { style: {
    display: "inline-flex",
    alignItems: "center",
    gap: 7,
    fontFamily: "var(--font-sans)",
    fontSize: size === "sm" ? 12 : 13,
    fontWeight: 600,
    color: "var(--label-neutral)",
    ...style
  }, ...rest, children: [
    /* @__PURE__ */ jsx118("span", { style: {
      display: "inline-flex",
      alignItems: "flex-end",
      gap: 2,
      height: h,
      animation: status === "reconnecting" ? "lk-conn-blink 1s var(--ease-in-out) infinite" : "none"
    }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx118("span", { style: {
      width: bw,
      height: Math.round(h * ((i + 1) / 3)),
      borderRadius: 1,
      background: i < cfg.bars ? cfg.c : "var(--fill-strong)"
    } }, i)) }),
    showLabel && /* @__PURE__ */ jsx118("span", { children: label || cfg.label })
  ] });
}

// components/robotics/EquipmentStatusCard.jsx
import React121 from "react";
import { jsx as jsx119, jsxs as jsxs83 } from "react/jsx-runtime";
var TONE = {
  positive: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  negative: "var(--bw-red)",
  signal: "var(--lk-accent-ink)",
  neutral: "var(--bw-gray)"
};
function useDimKeyframes() {
  React121.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-equip-dim-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-equip-dim-kf";
    el.textContent = "@keyframes lk-equip-dim{0%,100%{opacity:1}50%{opacity:.4}}";
    document.head.appendChild(el);
  }, []);
}
function EquipmentStatusCard({ icon, title, ringLabel, ringCaption, tone = "neutral", direction, connection, chips, style, ...rest }) {
  useDimKeyframes();
  const c = TONE[tone] || TONE.neutral;
  const moving = direction != null;
  const hasChips = chips && chips.length > 0;
  return /* @__PURE__ */ jsxs83(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 14,
        width: "100%",
        boxSizing: "border-box",
        padding: "14px 16px",
        background: "var(--surface-raised)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-xl)",
        boxShadow: "var(--shadow-sm)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ jsx119("span", { style: {
          width: 38,
          height: 38,
          borderRadius: "var(--radius-md)",
          flexShrink: 0,
          background: "var(--fill-normal)",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--label-alternative)"
        }, children: icon }),
        /* @__PURE__ */ jsxs83("div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ jsx119("div", { style: { fontSize: 15, fontWeight: 700, color: "var(--label-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
          (hasChips || ringCaption != null) && /* @__PURE__ */ jsx119("div", { style: { marginTop: 3, fontSize: 12, fontWeight: 600, color: "var(--label-alternative)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: hasChips ? chips.map((ch) => ch.label).join(" \xB7 ") : ringCaption })
        ] }),
        ringLabel != null && /* @__PURE__ */ jsxs83("span", { style: {
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          flexShrink: 0,
          whiteSpace: "nowrap",
          fontSize: 13,
          fontWeight: 600,
          letterSpacing: 0,
          color: "var(--label-neutral)",
          fontVariantNumeric: "tabular-nums"
        }, children: [
          moving ? /* @__PURE__ */ jsx119("span", { "aria-label": direction === "up" ? "\uC0C1\uC2B9 \uC911" : "\uD558\uAC15 \uC911", style: { display: "inline-flex", color: c, animation: "lk-equip-dim 1.5s var(--ease-in-out) infinite" }, children: /* @__PURE__ */ jsx119("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.6", strokeLinecap: "round", strokeLinejoin: "round", children: direction === "up" ? /* @__PURE__ */ jsx119("path", { d: "M12 19V5M5 12l7-7 7 7" }) : /* @__PURE__ */ jsx119("path", { d: "M12 5v14M19 12l-7 7-7-7" }) }) }) : connection != null ? /* @__PURE__ */ jsx119(ConnectionBadge, { status: connection, showLabel: false, size: "sm", style: { flexShrink: 0 } }) : /* @__PURE__ */ jsx119("span", { style: { width: 7, height: 7, borderRadius: "50%", background: c, flexShrink: 0 } }),
          ringLabel
        ] })
      ]
    }
  );
}

// components/robotics/Joystick.jsx
import React122 from "react";
import { jsx as jsx120, jsxs as jsxs84 } from "react/jsx-runtime";
function Joystick({ size = 160, onChange, onEnd, sticky = false, disabled = false, label, style, ...rest }) {
  const ref = React122.useRef(null);
  const [pos, setPos] = React122.useState({ x: 0, y: 0 });
  const [active, setActive] = React122.useState(false);
  const [focus, setFocus] = React122.useState(false);
  const R = size / 2;
  const knob = Math.round(size * 0.32);
  const max = R - knob / 2 - 4;
  const emit = (x, y) => {
    setPos({ x, y });
    onChange && onChange({ x: +(x / max).toFixed(3), y: +(-y / max).toFixed(3) });
  };
  const set = (cx, cy) => {
    const el = ref.current;
    if (!el) return;
    const b = el.getBoundingClientRect();
    let dx = cx - (b.left + R), dy = cy - (b.top + R);
    const dist = Math.hypot(dx, dy);
    if (dist > max) {
      dx = dx / dist * max;
      dy = dy / dist * max;
    }
    emit(dx, dy);
  };
  const start = (e) => {
    if (disabled) return;
    setActive(true);
    e.currentTarget.setPointerCapture(e.pointerId);
    set(e.clientX, e.clientY);
  };
  const move = (e) => {
    if (active) set(e.clientX, e.clientY);
  };
  const end = () => {
    setActive(false);
    if (!sticky) emit(0, 0);
    onEnd && onEnd();
  };
  const key = (e) => {
    if (disabled) return;
    const s = max * 0.34;
    let { x, y } = pos;
    if (e.key === "ArrowUp") y -= s;
    else if (e.key === "ArrowDown") y += s;
    else if (e.key === "ArrowLeft") x -= s;
    else if (e.key === "ArrowRight") x += s;
    else if (e.key === " " || e.key === "Escape") {
      x = 0;
      y = 0;
    } else return;
    e.preventDefault();
    const d = Math.hypot(x, y);
    if (d > max) {
      x = x / d * max;
      y = y / d * max;
    }
    emit(x, y);
  };
  return /* @__PURE__ */ jsxs84("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 10, ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs84(
      "div",
      {
        ref,
        role: "application",
        "aria-label": typeof label === "string" ? label : "\uC870\uC774\uC2A4\uD2F1",
        tabIndex: disabled ? -1 : 0,
        onPointerDown: start,
        onPointerMove: move,
        onPointerUp: end,
        onPointerCancel: end,
        onKeyDown: key,
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
        style: {
          position: "relative",
          width: size,
          height: size,
          borderRadius: "50%",
          outline: "none",
          background: "var(--fill-normal)",
          border: "1px solid var(--border-subtle)",
          boxShadow: focus ? "0 0 0 4px var(--focus-ring)" : "inset 0 2px 10px rgba(8,14,33,0.06)",
          touchAction: "none",
          cursor: disabled ? "not-allowed" : active ? "grabbing" : "grab",
          opacity: disabled ? 0.5 : 1
        },
        children: [
          /* @__PURE__ */ jsx120("span", { style: { position: "absolute", left: "50%", top: 10, bottom: 10, width: 1, background: "var(--line-neutral)", transform: "translateX(-0.5px)" } }),
          /* @__PURE__ */ jsx120("span", { style: { position: "absolute", top: "50%", left: 10, right: 10, height: 1, background: "var(--line-neutral)", transform: "translateY(-0.5px)" } }),
          /* @__PURE__ */ jsx120("span", { style: {
            position: "absolute",
            left: "50%",
            top: "50%",
            width: knob,
            height: knob,
            marginLeft: -knob / 2,
            marginTop: -knob / 2,
            borderRadius: "50%",
            background: "var(--lk-accent-ink)",
            boxShadow: "0 2px 8px rgba(8,14,33,0.28)",
            transform: `translate(${pos.x}px, ${pos.y}px)`,
            transition: active ? "none" : "transform var(--dur-base) var(--ease-out)"
          } })
        ]
      }
    ),
    label != null && /* @__PURE__ */ jsx120("span", { style: { fontFamily: "var(--font-sans)", fontSize: 12, fontWeight: 600, color: "var(--label-alternative)" }, children: label })
  ] });
}

// components/robotics/RobotStatusCard.jsx
import React123 from "react";
import { jsx as jsx121, jsxs as jsxs85 } from "react/jsx-runtime";
var CONN = {
  online: { c: "var(--bw-green)", bars: 3 },
  reconnecting: { c: "var(--bw-amber)", bars: 2 },
  offline: { c: "var(--bw-gray-300)", bars: 0 }
};
var BAR_H = [5, 8, 12];
function RobotStatusCard({ name, image, status = "online", battery, mode, selected = false, onClick, style, ...rest }) {
  const hasBat = typeof battery === "number";
  const b = Math.max(0, Math.min(100, battery));
  const batC = b <= 20 ? "var(--bw-red)" : b <= 50 ? "var(--bw-amber)" : "var(--bw-green)";
  const conn = CONN[status] || CONN.offline;
  return /* @__PURE__ */ jsxs85("div", { onClick, style: {
    display: "flex",
    gap: 16,
    alignItems: "center",
    padding: 16,
    width: "100%",
    boxSizing: "border-box",
    background: "var(--surface-raised)",
    border: `1px solid ${selected ? "var(--lk-accent-ink)" : "var(--border-subtle)"}`,
    borderRadius: "var(--radius-xl)",
    boxShadow: selected ? "0 0 0 3px var(--focus-ring)" : "var(--shadow-sm)",
    cursor: onClick ? "pointer" : "default",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: [
    /* @__PURE__ */ jsx121("div", { style: {
      width: 48,
      height: 48,
      borderRadius: "var(--radius-md)",
      flexShrink: 0,
      overflow: "hidden",
      background: "var(--fill-strong)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    }, children: image ? /* @__PURE__ */ jsx121("img", { src: image, alt: "", style: { width: "100%", height: "100%", objectFit: "cover" } }) : /* @__PURE__ */ jsx121("span", { style: { fontSize: 17, fontWeight: 800, color: "var(--label-neutral)" }, children: String(name || "?").slice(0, 2) }) }),
    /* @__PURE__ */ jsx121("span", { style: { flex: 1, minWidth: 0, fontSize: 16, fontWeight: 700, color: "var(--label-strong)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: name }),
    /* @__PURE__ */ jsxs85("div", { style: { display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 7, flexShrink: 0 }, children: [
      mode != null && /* @__PURE__ */ jsx121("span", { style: { fontSize: 11, fontWeight: 700, letterSpacing: 0, padding: "2px 8px", borderRadius: "var(--radius-pill)", background: "var(--lk-accent-tint)", color: "var(--label-normal)", whiteSpace: "nowrap" }, children: mode }),
      /* @__PURE__ */ jsxs85("div", { style: { display: "flex", alignItems: "center", gap: 8 }, children: [
        /* @__PURE__ */ jsx121("span", { role: "img", title: status, "aria-label": status, style: { display: "inline-flex", alignItems: "flex-end", gap: 2, height: 12 }, children: [0, 1, 2].map((i) => /* @__PURE__ */ jsx121("span", { style: { width: 3, height: BAR_H[i], borderRadius: 1, background: i < conn.bars ? conn.c : "var(--fill-strong)" } }, i)) }),
        hasBat && /* @__PURE__ */ jsxs85("span", { style: { display: "inline-flex", alignItems: "center", gap: 6 }, children: [
          /* @__PURE__ */ jsxs85("span", { style: { position: "relative", width: 24, height: 12, border: "1.5px solid var(--label-alternative)", borderRadius: 3, padding: 1.5, boxSizing: "border-box" }, children: [
            /* @__PURE__ */ jsx121("span", { style: { display: "block", height: "100%", width: `${b}%`, background: batC, borderRadius: 1 } }),
            /* @__PURE__ */ jsx121("span", { style: { position: "absolute", right: -3, top: "50%", transform: "translateY(-50%)", width: 2, height: 5, background: "var(--label-alternative)", borderRadius: "0 1px 1px 0" } })
          ] }),
          /* @__PURE__ */ jsxs85("span", { style: { fontSize: 12, fontWeight: 700, color: batC, fontVariantNumeric: "tabular-nums" }, children: [
            b,
            "%"
          ] })
        ] })
      ] })
    ] })
  ] });
}

// components/robotics/TopicTree.jsx
import React125 from "react";

// components/selection/Switch.jsx
import React124 from "react";
import { jsx as jsx122, jsxs as jsxs86 } from "react/jsx-runtime";
function Switch({
  checked,
  defaultChecked,
  onChange,
  label,
  size = "md",
  disabled = false,
  id,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = checked !== void 0;
  const [internal, setInternal] = React124.useState(!!defaultChecked);
  const [focus, setFocus] = React124.useState(false);
  const on = isControlled ? checked : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const d = size === "sm" ? { w: 40, h: 24, k: 18, tx: 16 } : { w: 52, h: 32, k: 26, tx: 20 };
  return /* @__PURE__ */ jsxs86(
    "label",
    {
      htmlFor: id,
      onClick: toggle,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 12,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        letterSpacing: 0,
        color: "var(--label-normal)"
      },
      children: [
        /* @__PURE__ */ jsx122(
          "span",
          {
            role: "switch",
            "aria-checked": on,
            "aria-label": ariaLabel ?? (typeof label === "string" ? label : "\uC2A4\uC704\uCE58"),
            id,
            tabIndex: disabled ? -1 : 0,
            onFocus: () => setFocus(true),
            onBlur: () => setFocus(false),
            onKeyDown: (e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                toggle();
              }
            },
            style: {
              position: "relative",
              flexShrink: 0,
              width: d.w,
              height: d.h,
              borderRadius: "var(--radius-pill)",
              background: on ? "var(--lk-accent-ink)" : "var(--bw-gray-300)",
              boxShadow: focus ? "0 0 0 4px var(--focus-ring)" : "none",
              transition: "background var(--dur-base) var(--ease-out), box-shadow var(--dur-fast) var(--ease-out)"
            },
            ...rest,
            children: /* @__PURE__ */ jsx122(
              "span",
              {
                style: {
                  position: "absolute",
                  top: 3,
                  left: 3,
                  width: d.k,
                  height: d.k,
                  borderRadius: "50%",
                  background: "#fff",
                  boxShadow: "0 1px 3px rgba(8,14,33,0.28)",
                  transform: on ? `translateX(${d.tx}px)` : "translateX(0)",
                  transition: "transform var(--dur-base) var(--ease-in-out)"
                }
              }
            )
          }
        ),
        label != null && /* @__PURE__ */ jsx122("span", { children: label })
      ]
    }
  );
}

// components/robotics/TopicTree.jsx
import { jsx as jsx123, jsxs as jsxs87 } from "react/jsx-runtime";
function TopicNode({ node, depth, onToggle }) {
  const kids = node.children || [];
  const has = kids.length > 0;
  const [open, setOpen] = React125.useState(depth < 1);
  const [hover, setHover] = React125.useState(false);
  const hasHz = typeof node.hz === "number";
  return /* @__PURE__ */ jsxs87("div", { children: [
    /* @__PURE__ */ jsxs87(
      "div",
      {
        onClick: () => has && setOpen(!open),
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        style: {
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "7px 10px",
          borderRadius: "var(--radius-sm)",
          cursor: has ? "pointer" : "default",
          background: hover ? "var(--fill-alt)" : "transparent",
          transition: "background var(--dur-fast) var(--ease-out)"
        },
        children: [
          /* @__PURE__ */ jsx123("span", { style: {
            width: 16,
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            color: "var(--label-assistive)",
            transform: open ? "none" : "rotate(-90deg)",
            transition: "transform var(--dur-fast) var(--ease-out)"
          }, children: has && /* @__PURE__ */ jsx123(Icon, { name: "chevron-down", size: 14 }) }),
          /* @__PURE__ */ jsx123("span", { style: { fontSize: 13.5, fontWeight: has ? 700 : 500, color: "var(--label-normal)" }, children: node.name }),
          node.type && /* @__PURE__ */ jsx123("code", { style: { fontSize: 11, color: "var(--label-alternative)", fontFamily: "ui-monospace,SFMono-Regular,monospace" }, children: node.type }),
          (hasHz || node.subscribable) && /* @__PURE__ */ jsxs87("span", { style: { marginLeft: "auto", display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }, children: [
            hasHz && /* @__PURE__ */ jsxs87("span", { style: { fontSize: 11, color: "var(--label-assistive)", fontVariantNumeric: "tabular-nums" }, children: [
              node.hz,
              " Hz"
            ] }),
            node.subscribable && /* @__PURE__ */ jsx123("span", { onClick: (e) => e.stopPropagation(), style: { display: "inline-flex" }, children: /* @__PURE__ */ jsx123(Switch, { size: "sm", checked: !!node.subscribed, onChange: () => onToggle && onToggle(node) }) })
          ] })
        ]
      }
    ),
    open && has && /* @__PURE__ */ jsx123("div", { style: { marginLeft: 18, borderLeft: "1px solid var(--bw-band)", paddingLeft: 2 }, children: kids.map((k, i) => /* @__PURE__ */ jsx123(TopicNode, { node: k, depth: depth + 1, onToggle }, i)) })
  ] });
}
function TopicTree({ nodes = [], onToggleSubscribe, style, ...rest }) {
  return /* @__PURE__ */ jsx123("div", { style: { fontFamily: "var(--font-sans)", ...style }, ...rest, children: nodes.map((n, i) => /* @__PURE__ */ jsx123(TopicNode, { node: n, depth: 0, onToggle: onToggleSubscribe }, i)) });
}

// components/selection/ChoiceCard.jsx
import React126 from "react";
import { jsx as jsx124, jsxs as jsxs88 } from "react/jsx-runtime";
function ChoiceCard({
  children,
  selected = false,
  disabled = false,
  multiple = false,
  onSelect,
  title,
  description,
  icon,
  style,
  ...rest
}) {
  const [hover, setHover] = React126.useState(false);
  const border = selected ? "var(--color-primary)" : hover && !disabled ? "var(--border-strong)" : "var(--border-subtle)";
  const toggle = () => {
    if (!disabled && onSelect) onSelect(!selected);
  };
  return /* @__PURE__ */ jsxs88(
    "div",
    {
      role: multiple ? "checkbox" : "radio",
      "aria-checked": selected,
      "aria-disabled": disabled || void 0,
      tabIndex: disabled ? -1 : 0,
      onClick: toggle,
      onKeyDown: (e) => {
        if ((e.key === "Enter" || e.key === " ") && !disabled) {
          e.preventDefault();
          toggle();
        }
      },
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        position: "relative",
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: 16,
        borderRadius: "var(--radius-xl)",
        background: selected ? "var(--lk-accent-tint)" : "var(--surface-raised)",
        boxShadow: `inset 0 0 0 ${selected ? 1.5 : 1}px ${border}`,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        transition: "box-shadow var(--dur-fast) var(--ease-out), background var(--dur-fast) var(--ease-out)",
        outline: "none",
        ...style
      },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ jsx124("span", { style: { flexShrink: 0, color: selected ? "var(--color-accent)" : "var(--label-neutral)", display: "inline-flex" }, children: icon }),
        /* @__PURE__ */ jsxs88("div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ jsx124("div", { style: { fontSize: 15, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-strong)", wordBreak: "keep-all" }, children: title }),
          description != null && /* @__PURE__ */ jsx124("div", { style: { marginTop: 3, fontSize: 13, lineHeight: 1.55, color: "var(--label-alternative)", wordBreak: "keep-all" }, children: description }),
          children
        ] }),
        /* @__PURE__ */ jsx124(
          "span",
          {
            "aria-hidden": "true",
            style: {
              flexShrink: 0,
              width: 20,
              height: 20,
              borderRadius: multiple ? "var(--radius-sm)" : "50%",
              background: selected ? "var(--color-primary)" : "transparent",
              boxShadow: selected ? "none" : `inset 0 0 0 1.5px var(--line-strong)`,
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              transition: "background var(--dur-fast) var(--ease-out)"
            },
            children: selected && /* @__PURE__ */ jsx124("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3.4", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx124("path", { d: "M20 6 9 17l-5-5" }) })
          }
        )
      ]
    }
  );
}

// components/selection/FilterChip.jsx
import React127 from "react";
import { jsx as jsx125, jsxs as jsxs89 } from "react/jsx-runtime";
function FilterChip({
  children,
  active = false,
  count,
  caret = false,
  disabled = false,
  onClick,
  style,
  ...rest
}) {
  const [hover, setHover] = React127.useState(false);
  return /* @__PURE__ */ jsxs89(
    "button",
    {
      type: "button",
      "aria-pressed": active,
      disabled,
      onClick: disabled ? void 0 : onClick,
      onMouseEnter: () => setHover(true),
      onMouseLeave: () => setHover(false),
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        height: 38,
        padding: "0 15px",
        background: active ? "var(--lk-accent-tint-2)" : hover && !disabled ? "var(--fill-normal)" : "var(--bw-white)",
        border: `1px solid ${active ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        color: active ? "var(--lk-accent-ink)" : "var(--label-neutral)",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx125("span", { children }),
        count != null && /* @__PURE__ */ jsx125("span", { style: { fontWeight: "var(--fw-bold)", color: active ? "var(--lk-accent-ink)" : "var(--label-alternative)" }, children: count }),
        caret && /* @__PURE__ */ jsx125("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx125("path", { d: "m6 9 6 6 6-6" }) })
      ]
    }
  );
}

// components/selection/MultiSelectChip.jsx
import React128 from "react";
import { jsx as jsx126, jsxs as jsxs90 } from "react/jsx-runtime";
function MultiSelectChip({
  children,
  selected,
  defaultSelected,
  onChange,
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = selected !== void 0;
  const [internal, setInternal] = React128.useState(!!defaultSelected);
  const on = isControlled ? selected : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  return /* @__PURE__ */ jsxs90(
    "button",
    {
      type: "button",
      "aria-pressed": on,
      disabled,
      onClick: toggle,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        height: 38,
        padding: on ? "0 15px 0 11px" : "0 15px",
        background: on ? "var(--lk-accent-tint-2)" : "var(--bw-white)",
        border: `1px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
        borderRadius: "var(--radius-pill)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        fontSize: 14,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        color: on ? "var(--lk-accent-ink)" : "var(--label-neutral)",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out), padding var(--dur-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children: [
        on && /* @__PURE__ */ jsx126("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: /* @__PURE__ */ jsx126("path", { d: "M20 6 9 17l-5-5" }) }),
        /* @__PURE__ */ jsx126("span", { children })
      ]
    }
  );
}

// components/selection/SegmentedControl.jsx
import React129 from "react";
import { jsx as jsx127 } from "react/jsx-runtime";
function SegmentedControl({
  options = [],
  value,
  defaultValue,
  onChange,
  size = "md",
  full = false,
  style,
  ...rest
}) {
  const norm = options.map((o) => typeof o === "string" ? { value: o, label: o } : o);
  const isControlled = value !== void 0;
  const [internal, setInternal] = React129.useState(defaultValue != null ? defaultValue : norm[0] && norm[0].value);
  const val = isControlled ? value : internal;
  const pick = (v) => {
    if (!isControlled) setInternal(v);
    onChange && onChange(v);
  };
  const h = size === "sm" ? 36 : 44;
  const fs = size === "sm" ? 14 : 15;
  return /* @__PURE__ */ jsx127(
    "div",
    {
      role: "tablist",
      style: {
        display: "inline-flex",
        width: full ? "100%" : void 0,
        padding: 4,
        gap: 2,
        background: "var(--fill-normal)",
        borderRadius: "var(--radius-md)",
        ...style
      },
      ...rest,
      children: norm.map((o) => {
        const active = o.value === val;
        return /* @__PURE__ */ jsx127(
          "button",
          {
            type: "button",
            role: "tab",
            "aria-selected": active,
            onClick: () => pick(o.value),
            style: {
              flex: full ? 1 : void 0,
              height: h,
              padding: "0 18px",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
              fontSize: fs,
              fontWeight: active ? "var(--fw-bold)" : "var(--fw-medium)",
              letterSpacing: 0,
              color: active ? "var(--label-normal)" : "var(--label-alternative)",
              background: active ? "var(--bw-white)" : "transparent",
              borderRadius: "var(--radius-sm)",
              boxShadow: active ? "var(--shadow-xs)" : "none",
              transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
              whiteSpace: "nowrap"
            },
            children: o.label
          },
          o.value
        );
      })
    }
  );
}

// components/selection/Stepper.jsx
import React130 from "react";
import { jsx as jsx128, jsxs as jsxs91 } from "react/jsx-runtime";
function Stepper({
  value,
  defaultValue = 0,
  min = -Infinity,
  max = Infinity,
  step = 1,
  onChange,
  size = "md",
  disabled = false,
  style,
  ...rest
}) {
  const isControlled = value !== void 0;
  const [internal, setInternal] = React130.useState(defaultValue);
  const val = isControlled ? value : internal;
  const set = (next) => {
    const clamped = Math.min(max, Math.max(min, next));
    if (!isControlled) setInternal(clamped);
    onChange && onChange(clamped);
  };
  const h = size === "sm" ? 36 : 44;
  const StepBtn = ({ kind }) => {
    const isMinus = kind === "minus";
    const off = disabled || (isMinus ? val <= min : val >= max);
    return /* @__PURE__ */ jsx128(
      "button",
      {
        type: "button",
        "aria-label": isMinus ? "decrease" : "increase",
        disabled: off,
        onClick: () => set(val + (isMinus ? -step : step)),
        onMouseEnter: (e) => {
          if (!off) e.currentTarget.style.background = "var(--fill-normal)";
        },
        onMouseLeave: (e) => {
          e.currentTarget.style.background = "transparent";
        },
        style: {
          width: h,
          height: h,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          border: "none",
          background: "transparent",
          cursor: off ? "not-allowed" : "pointer",
          color: off ? "var(--label-disable)" : "var(--label-normal)",
          borderRadius: "var(--radius-md)",
          transition: "background var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)"
        },
        children: /* @__PURE__ */ jsxs91("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.4", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
          /* @__PURE__ */ jsx128("path", { d: "M5 12h14" }),
          !isMinus && /* @__PURE__ */ jsx128("path", { d: "M12 5v14" })
        ] })
      }
    );
  };
  return /* @__PURE__ */ jsxs91(
    "div",
    {
      style: {
        display: "inline-flex",
        alignItems: "center",
        height: h,
        border: "1px solid var(--bw-border)",
        borderRadius: "var(--radius-md)",
        background: "var(--bw-white)",
        opacity: disabled ? 0.5 : 1,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx128(StepBtn, { kind: "minus" }),
        /* @__PURE__ */ jsx128(
          "span",
          {
            "aria-live": "polite",
            style: {
              minWidth: 40,
              textAlign: "center",
              fontFamily: "var(--font-sans)",
              fontSize: size === "sm" ? 15 : 16,
              fontWeight: "var(--fw-bold)",
              letterSpacing: 0,
              color: "var(--label-normal)",
              fontVariantNumeric: "tabular-nums"
            },
            children: val
          }
        ),
        /* @__PURE__ */ jsx128(StepBtn, { kind: "plus" })
      ]
    }
  );
}

// components/selection/ThemeToggle.jsx
import React131 from "react";
import { jsx as jsx129, jsxs as jsxs92 } from "react/jsx-runtime";
var ICONS = {
  light: '<circle cx="12" cy="12" r="4.2"/><path d="M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6"/>',
  dark: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  auto: '<rect x="3" y="4" width="18" height="12.5" rx="2"/><path d="M8.5 20.5h7M12 16.5v4"/>'
};
var LABELS = { light: "Light", dark: "Dark", auto: "Auto" };
function ThemeToggle({
  target,
  storageKey = "lk-theme",
  options = ["light", "dark", "auto"],
  value,
  defaultValue = "light",
  onChange,
  size = "md",
  showLabels = true,
  persist = true,
  style,
  ...rest
}) {
  const resolveTarget = React131.useCallback(() => {
    if (target === null) return null;
    if (target && target.nodeType) return target;
    if (typeof target === "string") return document.querySelector(target);
    return typeof document !== "undefined" ? document.documentElement : null;
  }, [target]);
  const [internal, setInternal] = React131.useState(() => {
    if (value) return value;
    if (persist) {
      try {
        const s = localStorage.getItem(storageKey);
        if (s && options.indexOf(s) !== -1) return s;
      } catch (e) {
      }
    }
    return defaultValue;
  });
  const cur = value != null ? value : internal;
  const apply = React131.useCallback((v) => {
    const el = resolveTarget();
    if (el) el.setAttribute("data-theme", v);
    if (persist) {
      try {
        localStorage.setItem(storageKey, v);
      } catch (e) {
      }
    }
  }, [resolveTarget, storageKey, persist]);
  React131.useEffect(() => {
    apply(cur);
  }, [cur, apply]);
  const pick = (v) => {
    if (v === cur) return;
    if (value == null) setInternal(v);
    else apply(v);
    onChange && onChange(v);
  };
  const h = size === "sm" ? 32 : 38;
  const fs = size === "sm" ? 12.5 : 13.5;
  const isz = size === "sm" ? 15 : 16;
  return /* @__PURE__ */ jsx129(
    "div",
    {
      role: "radiogroup",
      "aria-label": "\uD14C\uB9C8",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: 3,
        height: h,
        padding: 3,
        boxSizing: "border-box",
        background: "var(--fill-normal)",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-pill)",
        ...style
      },
      ...rest,
      children: options.map((v) => {
        const on = cur === v;
        return /* @__PURE__ */ jsxs92(
          "button",
          {
            type: "button",
            role: "radio",
            "aria-checked": on,
            "aria-label": LABELS[v] || v,
            onClick: () => pick(v),
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              gap: showLabels ? 7 : 0,
              height: h - 6,
              paddingInline: showLabels ? 13 : 9,
              minWidth: showLabels ? 0 : h - 6,
              border: "none",
              borderRadius: "var(--radius-pill)",
              cursor: "pointer",
              background: on ? "var(--surface-card)" : "transparent",
              boxShadow: on ? "var(--shadow-xs)" : "none",
              color: on ? "var(--accent-text)" : "var(--label-alternative)",
              fontFamily: "var(--font-sans)",
              fontSize: fs,
              fontWeight: "var(--fw-bold)",
              letterSpacing: 0,
              transition: "var(--component-button-transition)"
            },
            children: [
              /* @__PURE__ */ jsx129("svg", { width: isz, height: isz, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", dangerouslySetInnerHTML: { __html: ICONS[v] || "" } }),
              showLabels && /* @__PURE__ */ jsx129("span", { children: LABELS[v] || v })
            ]
          },
          v
        );
      })
    }
  );
}

// components/selection/ToggleButton.jsx
import React132 from "react";
import { jsx as jsx130, jsxs as jsxs93 } from "react/jsx-runtime";
function ToggleButton({
  children,
  pressed,
  defaultPressed,
  onChange,
  icon,
  size = "md",
  disabled = false,
  style,
  "aria-label": ariaLabel,
  ...rest
}) {
  const isControlled = pressed !== void 0;
  const [internal, setInternal] = React132.useState(!!defaultPressed);
  const on = isControlled ? pressed : internal;
  const toggle = () => {
    if (disabled) return;
    if (!isControlled) setInternal(!on);
    onChange && onChange(!on);
  };
  const h = size === "sm" ? 36 : 44;
  const iconOnly = children == null;
  return /* @__PURE__ */ jsxs93(
    "button",
    {
      type: "button",
      "aria-pressed": on,
      "aria-label": ariaLabel ?? (iconOnly ? "\uD1A0\uAE00" : void 0),
      disabled,
      onClick: toggle,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        height: h,
        width: iconOnly ? h : void 0,
        padding: iconOnly ? 0 : "0 16px",
        background: on ? "var(--lk-accent-tint-2)" : "var(--bw-white)",
        border: `1px solid ${on ? "var(--lk-accent-ink)" : "var(--bw-border)"}`,
        borderRadius: "var(--radius-md)",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        fontFamily: "var(--font-sans)",
        fontSize: 15,
        fontWeight: "var(--fw-semibold)",
        letterSpacing: 0,
        color: on ? "var(--lk-accent-ink)" : "var(--label-neutral)",
        transition: "background var(--dur-fast) var(--ease-out), border-color var(--dur-fast) var(--ease-out), color var(--dur-fast) var(--ease-out)",
        whiteSpace: "nowrap",
        ...style
      },
      ...rest,
      children: [
        icon,
        children != null && /* @__PURE__ */ jsx130("span", { children })
      ]
    }
  );
}

// components/status/Banner.jsx
import React133 from "react";
import { jsx as jsx131, jsxs as jsxs94 } from "react/jsx-runtime";
var TONES3 = {
  info: { c: "var(--lk-accent-ink)", d: '<circle cx="12" cy="12" r="9"/><path d="M12 11.5v5"/><path d="M12 8h.01"/>' },
  success: { c: "var(--bw-green)", d: '<circle cx="12" cy="12" r="9"/><path d="m8.4 12 2.6 2.6 4.6-5.2"/>' },
  warning: { c: "var(--bw-amber)", d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' },
  error: { c: "var(--bw-red)", d: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5"/><path d="M12 16.5h.01"/>' }
};
function Banner({ tone = "info", title, children, action, onClose, style, ...rest }) {
  const t = TONES3[tone] || TONES3.info;
  return /* @__PURE__ */ jsxs94(
    "div",
    {
      role: "status",
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "14px 16px",
        background: `color-mix(in srgb, ${t.c} 9%, var(--surface-card))`,
        border: `1px solid color-mix(in srgb, ${t.c} 26%, var(--surface-card))`,
        borderRadius: "var(--radius-lg)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx131("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: t.c, strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { flexShrink: 0, marginTop: 1 }, dangerouslySetInnerHTML: { __html: t.d } }),
        /* @__PURE__ */ jsxs94("div", { style: { flex: 1, minWidth: 0 }, children: [
          title != null && /* @__PURE__ */ jsx131("div", { style: { fontSize: 14.5, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)", marginBottom: children != null ? 3 : 0 }, children: title }),
          children != null && /* @__PURE__ */ jsx131("div", { style: { fontSize: 13.5, lineHeight: 1.6, color: "var(--label-neutral)", wordBreak: "keep-all" }, children })
        ] }),
        action != null && /* @__PURE__ */ jsx131("div", { style: { flexShrink: 0 }, children: action }),
        onClose && /* @__PURE__ */ jsx131("button", { type: "button", "aria-label": "close", onClick: onClose, style: { flexShrink: 0, display: "inline-flex", padding: 2, border: "none", background: "transparent", cursor: "pointer", color: "var(--label-assistive)" }, children: /* @__PURE__ */ jsx131("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx131("path", { d: "M18 6 6 18M6 6l12 12" }) }) })
      ]
    }
  );
}

// components/status/Callout.jsx
import React134 from "react";
import { jsx as jsx132, jsxs as jsxs95 } from "react/jsx-runtime";
var CT = { signal: "var(--lk-accent-ink)", positive: "var(--bw-green)", cautionary: "var(--bw-amber)", negative: "var(--bw-red)", navy: "var(--bw-ink)" };
function Callout({ tone = "signal", title, children, icon, style, ...rest }) {
  const c = CT[tone] || CT.signal;
  return /* @__PURE__ */ jsxs95("div", { style: { display: "flex", gap: 14, padding: "16px 18px", background: `color-mix(in srgb, ${c} 8%, var(--surface-card))`, borderRadius: "var(--radius-lg)", borderLeft: `3px solid ${c}`, fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    icon && /* @__PURE__ */ jsx132("span", { style: { color: c, flexShrink: 0, marginTop: 1 }, children: icon }),
    /* @__PURE__ */ jsxs95("div", { style: { flex: 1, minWidth: 0 }, children: [
      title != null && /* @__PURE__ */ jsx132("div", { style: { fontSize: 15, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)", marginBottom: children != null ? 4 : 0 }, children: title }),
      children != null && /* @__PURE__ */ jsx132("div", { style: { fontSize: 14, lineHeight: 1.65, color: "var(--label-neutral)", wordBreak: "keep-all" }, children })
    ] })
  ] });
}

// components/status/CircularProgress.jsx
import React135 from "react";
import { jsx as jsx133, jsxs as jsxs96 } from "react/jsx-runtime";
function CircularProgress({ value = 0, max = 100, size = 48, thickness = 5, tone = "signal", showValue = false, style, ...rest }) {
  const c = tone === "positive" ? "var(--bw-green)" : tone === "cautionary" ? "var(--bw-amber)" : tone === "negative" ? "var(--bw-red)" : "var(--lk-accent-ink)";
  const pct = Math.max(0, Math.min(100, value / max * 100));
  const r = (size - thickness) / 2;
  const circ = 2 * Math.PI * r;
  return /* @__PURE__ */ jsxs96("span", { style: { position: "relative", display: "inline-flex", width: size, height: size, ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs96("svg", { width: size, height: size, style: { transform: "rotate(-90deg)" }, children: [
      /* @__PURE__ */ jsx133("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: "var(--fill-strong)", strokeWidth: thickness }),
      /* @__PURE__ */ jsx133("circle", { cx: size / 2, cy: size / 2, r, fill: "none", stroke: c, strokeWidth: thickness, strokeLinecap: "round", strokeDasharray: circ, strokeDashoffset: circ * (1 - pct / 100), style: { transition: "stroke-dashoffset var(--dur-base) var(--ease-out)" } })
    ] }),
    showValue && /* @__PURE__ */ jsx133("span", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-sans)", fontSize: Math.round(size * 0.28), fontWeight: "var(--fw-bold)", color: "var(--label-normal)", fontVariantNumeric: "tabular-nums" }, children: Math.round(pct) })
  ] });
}

// components/status/EmptyState.jsx
import React136 from "react";
import { jsx as jsx134, jsxs as jsxs97 } from "react/jsx-runtime";
function EmptyState({ icon, title, description, action, style, ...rest }) {
  return /* @__PURE__ */ jsxs97(
    "div",
    {
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        gap: 6,
        padding: "48px 24px",
        fontFamily: "var(--font-sans)",
        maxWidth: 420,
        margin: "0 auto",
        ...style
      },
      ...rest,
      children: [
        icon != null && /* @__PURE__ */ jsx134("div", { style: {
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          width: 56,
          height: 56,
          borderRadius: "var(--radius-xl)",
          background: "var(--lk-accent-tint)",
          color: "var(--lk-accent-ink)",
          marginBottom: 12
        }, children: icon }),
        title != null && /* @__PURE__ */ jsx134("div", { style: { fontSize: 18, fontWeight: "var(--fw-bold)", letterSpacing: 0, color: "var(--label-normal)" }, children: title }),
        description != null && /* @__PURE__ */ jsx134("div", { style: { fontSize: 14, lineHeight: 1.65, color: "var(--label-alternative)", wordBreak: "keep-all" }, children: description }),
        action != null && /* @__PURE__ */ jsx134("div", { style: { marginTop: 14 }, children: action })
      ]
    }
  );
}

// components/status/Meter.jsx
import React137 from "react";
import { jsx as jsx135, jsxs as jsxs98 } from "react/jsx-runtime";
function Meter({ value = 0, max = 100, label, thresholds, size = "md", showValue = true, style, ...rest }) {
  const pct = Math.max(0, Math.min(100, value / max * 100));
  let c = "var(--lk-accent-ink)";
  if (thresholds) {
    if (pct <= thresholds.low) c = "var(--bw-red)";
    else if (pct <= thresholds.high) c = "var(--bw-amber)";
    else c = "var(--bw-green)";
  }
  const h = size === "sm" ? 6 : 10;
  return /* @__PURE__ */ jsxs98("div", { style: { ...style }, ...rest, children: [
    (label != null || showValue) && /* @__PURE__ */ jsxs98("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 6, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: "var(--fw-semibold)", color: "var(--label-neutral)" }, children: [
      /* @__PURE__ */ jsx135("span", { children: label }),
      showValue && /* @__PURE__ */ jsxs98("span", { style: { fontVariantNumeric: "tabular-nums", color: "var(--label-alternative)" }, children: [
        value,
        "/",
        max
      ] })
    ] }),
    /* @__PURE__ */ jsx135("div", { style: { height: h, borderRadius: "var(--radius-pill)", background: "var(--fill-strong)", overflow: "hidden" }, children: /* @__PURE__ */ jsx135("span", { style: { display: "block", height: "100%", width: `${pct}%`, background: c, borderRadius: "var(--radius-pill)", transition: "width var(--dur-base) var(--ease-out), background var(--dur-base) var(--ease-out)" } }) })
  ] });
}

// components/status/ProgressBar.jsx
import React138 from "react";
import { jsx as jsx136, jsxs as jsxs99 } from "react/jsx-runtime";
function useKeyframes(id, css) {
  React138.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
var TONES4 = {
  signal: "var(--lk-accent-ink)",
  positive: "var(--bw-green)",
  cautionary: "var(--bw-amber)",
  negative: "var(--bw-red)"
};
function ProgressBar({ value = 0, max = 100, indeterminate = false, tone = "signal", size = "md", label, showValue = false, style, ...rest }) {
  useKeyframes("lk-prog-kf", "@keyframes lk-prog-indet{0%{left:-45%;width:45%}50%{width:55%}100%{left:100%;width:45%}}");
  const c = TONES4[tone] || TONES4.signal;
  const h = size === "sm" ? 4 : size === "lg" ? 10 : 6;
  const pct = Math.max(0, Math.min(100, value / max * 100));
  return /* @__PURE__ */ jsxs99("div", { style: { ...style }, ...rest, children: [
    (label != null || showValue) && /* @__PURE__ */ jsxs99("div", { style: { display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 8, fontFamily: "var(--font-sans)", fontSize: 13, fontWeight: "var(--fw-semibold)", color: "var(--label-neutral)" }, children: [
      /* @__PURE__ */ jsx136("span", { children: label }),
      showValue && /* @__PURE__ */ jsxs99("span", { style: { color: "var(--label-alternative)", fontVariantNumeric: "tabular-nums" }, children: [
        Math.round(pct),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx136(
      "div",
      {
        role: "progressbar",
        "aria-valuenow": indeterminate ? void 0 : Math.round(pct),
        "aria-valuemin": 0,
        "aria-valuemax": 100,
        style: { position: "relative", height: h, borderRadius: "var(--radius-pill)", background: "var(--fill-strong)", overflow: "hidden" },
        children: indeterminate ? /* @__PURE__ */ jsx136("span", { style: { position: "absolute", top: 0, bottom: 0, background: c, borderRadius: "var(--radius-pill)", animation: "lk-prog-indet 1.3s var(--ease-in-out) infinite" } }) : /* @__PURE__ */ jsx136("span", { style: { position: "absolute", top: 0, left: 0, bottom: 0, width: `${pct}%`, background: c, borderRadius: "var(--radius-pill)", transition: "width var(--dur-base) var(--ease-out)" } })
      }
    )
  ] });
}

// components/status/Skeleton.jsx
import React139 from "react";
import { jsx as jsx137 } from "react/jsx-runtime";
function useKeyframes2(id, css) {
  React139.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function Skeleton({ variant = "rect", width = "100%", height, radius, lines = 1, align = "leading", tone = "normal", style, ...rest }) {
  useKeyframes2("lk-skel-kf", "@keyframes lk-skel{0%{background-position:200% 0}100%{background-position:-200% 0}}");
  const shimmer = tone === "light" ? "linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.20) 37%, rgba(255,255,255,0.10) 63%)" : "linear-gradient(90deg, var(--fill-normal) 25%, var(--fill-strong) 37%, var(--fill-normal) 63%)";
  const base = {
    background: shimmer,
    backgroundSize: "200% 100%",
    animation: "lk-skel 1.4s ease-in-out infinite"
  };
  if (variant === "text") {
    const h2 = height || 14;
    const alignItems = align === "center" ? "center" : align === "trailing" ? "flex-end" : "flex-start";
    return /* @__PURE__ */ jsx137("span", { style: { display: "flex", flexDirection: "column", alignItems, ...style }, ...rest, children: Array.from({ length: lines }).map((_, i) => /* @__PURE__ */ jsx137("span", { style: { display: "block", height: h2, width: i === lines - 1 && lines > 1 ? "70%" : width, borderRadius: "var(--radius-sm)", marginTop: i ? 10 : 0, ...base } }, i)) });
  }
  const isCircle = variant === "circle";
  const r = isCircle ? "50%" : radius != null ? radius : "var(--radius-lg)";
  const w = isCircle ? width === "100%" ? 40 : width : width;
  const h = isCircle ? height || (width === "100%" ? 40 : width) : height || 16;
  return /* @__PURE__ */ jsx137("span", { style: { display: "inline-block", width: w, height: h, borderRadius: r, ...base, ...style }, ...rest });
}

// components/status/Spinner.jsx
import React140 from "react";
import { jsx as jsx138, jsxs as jsxs100 } from "react/jsx-runtime";
function useKeyframes3(id, css) {
  React140.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById(id)) return;
    const el = document.createElement("style");
    el.id = id;
    el.textContent = css;
    document.head.appendChild(el);
  }, [id, css]);
}
function Spinner({ size = 24, thickness, color = "var(--lk-accent-ink)", label, style, ...rest }) {
  useKeyframes3("lk-spin-kf", "@keyframes lk-spin{to{transform:rotate(360deg)}}");
  const t = thickness || Math.max(2, Math.round(size / 10));
  const ring = /* @__PURE__ */ jsx138("span", { style: {
    width: size,
    height: size,
    borderRadius: "50%",
    boxSizing: "border-box",
    border: `${t}px solid var(--fill-strong)`,
    borderTopColor: color,
    animation: "lk-spin 0.7s linear infinite",
    flexShrink: 0
  } });
  if (label == null) {
    return /* @__PURE__ */ jsx138("span", { role: "status", "aria-label": "loading", style: { display: "inline-flex", ...style }, ...rest, children: ring });
  }
  return /* @__PURE__ */ jsxs100("span", { role: "status", style: { display: "inline-flex", alignItems: "center", gap: 10, fontFamily: "var(--font-sans)", fontSize: 14, color: "inherit", ...style }, ...rest, children: [
    ring,
    /* @__PURE__ */ jsx138("span", { children: label })
  ] });
}

// components/viz/Map2DCanvas.jsx
import React141 from "react";
import { jsx as jsx139, jsxs as jsxs101 } from "react/jsx-runtime";
function ZBtn({ children, onClick, label }) {
  return /* @__PURE__ */ jsx139(
    "button",
    {
      type: "button",
      onClick,
      "aria-label": label,
      title: label,
      style: {
        width: 30,
        height: 30,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid var(--border-subtle)",
        borderRadius: "var(--radius-sm)",
        background: "var(--surface-raised)",
        color: "var(--label-neutral)",
        cursor: "pointer",
        fontSize: 16,
        fontWeight: 700,
        lineHeight: 1,
        boxShadow: "var(--shadow-sm)"
      },
      children
    }
  );
}
function Map2DCanvas({ children, minZoom = 0.25, maxZoom = 8, grid = true, controls = true, style, ...rest }) {
  const [t, setT] = React141.useState({ x: 0, y: 0, z: 1 });
  const drag = React141.useRef(null);
  const clamp = (z) => Math.max(minZoom, Math.min(maxZoom, z));
  const down = (e) => {
    drag.current = { x: e.clientX, y: e.clientY, tx: t.x, ty: t.y };
    e.currentTarget.setPointerCapture(e.pointerId);
  };
  const move = (e) => {
    const d = drag.current;
    if (!d) return;
    setT((p) => ({ ...p, x: d.tx + (e.clientX - d.x), y: d.ty + (e.clientY - d.y) }));
  };
  const up = () => {
    drag.current = null;
  };
  const wheel = (e) => {
    e.preventDefault();
    setT((p) => ({ ...p, z: clamp(p.z * (e.deltaY < 0 ? 1.1 : 0.9)) }));
  };
  const zoom = (f) => setT((p) => ({ ...p, z: clamp(p.z * f) }));
  return /* @__PURE__ */ jsxs101(
    "div",
    {
      onPointerDown: down,
      onPointerMove: move,
      onPointerUp: up,
      onPointerCancel: up,
      onWheel: wheel,
      style: {
        position: "relative",
        overflow: "hidden",
        width: "100%",
        height: "100%",
        minHeight: 200,
        borderRadius: "var(--radius-lg)",
        border: "1px solid var(--border-subtle)",
        background: "var(--surface-sunken)",
        cursor: "grab",
        touchAction: "none",
        fontFamily: "var(--font-sans)",
        backgroundImage: grid ? "linear-gradient(var(--line-neutral) 1px,transparent 1px),linear-gradient(90deg,var(--line-neutral) 1px,transparent 1px)" : "none",
        backgroundSize: grid ? `${24 * t.z}px ${24 * t.z}px` : void 0,
        backgroundPosition: grid ? `${t.x}px ${t.y}px` : void 0,
        ...style
      },
      ...rest,
      children: [
        /* @__PURE__ */ jsx139("div", { style: { position: "absolute", left: "50%", top: "50%", transform: `translate(${t.x}px, ${t.y}px) scale(${t.z})`, transformOrigin: "0 0" }, children }),
        controls && /* @__PURE__ */ jsxs101("div", { style: { position: "absolute", right: 10, bottom: 10, display: "flex", flexDirection: "column", gap: 4 }, children: [
          /* @__PURE__ */ jsx139(ZBtn, { label: "\uD655\uB300", onClick: () => zoom(1.2), children: "+" }),
          /* @__PURE__ */ jsx139(ZBtn, { label: "\uCD95\uC18C", onClick: () => zoom(0.8), children: "\u2212" }),
          /* @__PURE__ */ jsx139(ZBtn, { label: "\uCD08\uAE30\uD654", onClick: () => setT({ x: 0, y: 0, z: 1 }), children: "\u293E" })
        ] }),
        controls && /* @__PURE__ */ jsxs101("span", { style: { position: "absolute", left: 10, bottom: 10, fontSize: 11, fontWeight: 700, color: "var(--label-alternative)", background: "var(--surface-raised)", border: "1px solid var(--border-subtle)", borderRadius: "var(--radius-sm)", padding: "2px 7px", fontVariantNumeric: "tabular-nums" }, children: [
          Math.round(t.z * 100),
          "%"
        ] })
      ]
    }
  );
}

// components/viz/Scene3DFrame.jsx
import React142 from "react";
import { jsx as jsx140, jsxs as jsxs102 } from "react/jsx-runtime";
function Scene3DFrame({ children, title, badges, toolbar, loading = false, empty, style, ...rest }) {
  return /* @__PURE__ */ jsxs102("div", { style: {
    position: "relative",
    width: "100%",
    height: "100%",
    minHeight: 220,
    borderRadius: "var(--radius-lg)",
    overflow: "hidden",
    background: "var(--surface-inverse)",
    border: "1px solid var(--border-subtle)",
    fontFamily: "var(--font-sans)",
    ...style
  }, ...rest, children: [
    children,
    (title != null || badges != null) && /* @__PURE__ */ jsxs102("div", { style: { position: "absolute", left: 12, top: 12, display: "flex", alignItems: "center", gap: 8, pointerEvents: "none" }, children: [
      title != null && /* @__PURE__ */ jsx140("span", { style: { fontSize: 12, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase", color: "var(--text-on-inverse)", opacity: 0.9 }, children: title }),
      badges
    ] }),
    toolbar != null && /* @__PURE__ */ jsx140("div", { style: { position: "absolute", right: 12, top: 12 }, children: toolbar }),
    loading && /* @__PURE__ */ jsx140("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", gap: 10, background: "rgba(8,14,33,0.45)", color: "var(--text-on-inverse)", fontSize: 13, fontWeight: 600 }, children: "\uBD88\uB7EC\uC624\uB294 \uC911\u2026" }),
    !loading && empty != null && /* @__PURE__ */ jsx140("div", { style: { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", color: "rgba(255,255,255,0.52)", fontSize: 13 }, children: empty })
  ] });
}

// components/viz/TelemetryGauge.jsx
import React143 from "react";
import { jsx as jsx141, jsxs as jsxs103 } from "react/jsx-runtime";
var TONE2 = { signal: "var(--lk-accent-ink)", positive: "var(--bw-green)", cautionary: "var(--bw-amber)", negative: "var(--bw-red)" };
function TelemetryGauge({ value = 0, min = 0, max = 100, unit = "", label, size = 120, thickness = 10, thresholds, tone, style, ...rest }) {
  const pct = Math.max(0, Math.min(1, (value - min) / (max - min || 1)));
  let c = "var(--lk-accent-ink)";
  if (tone) c = TONE2[tone] || c;
  else if (thresholds) {
    const p = pct * 100;
    c = p <= thresholds.low ? "var(--bw-red)" : p <= thresholds.high ? "var(--bw-amber)" : "var(--bw-green)";
  }
  const r = (size - thickness) / 2, cx = size / 2, cy = size / 2, C = 2 * Math.PI * r, arc = 0.75, dash = C * arc;
  return /* @__PURE__ */ jsxs103("div", { style: { display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6, fontFamily: "var(--font-sans)", ...style }, ...rest, children: [
    /* @__PURE__ */ jsxs103("div", { style: { position: "relative", width: size, height: size }, children: [
      /* @__PURE__ */ jsxs103("svg", { width: size, height: size, viewBox: `0 0 ${size} ${size}`, style: { transform: "rotate(135deg)" }, children: [
        /* @__PURE__ */ jsx141("circle", { cx, cy, r, fill: "none", stroke: "var(--fill-strong)", strokeWidth: thickness, strokeLinecap: "round", strokeDasharray: `${dash} ${C}` }),
        /* @__PURE__ */ jsx141("circle", { cx, cy, r, fill: "none", stroke: c, strokeWidth: thickness, strokeLinecap: "round", strokeDasharray: `${dash * pct} ${C}`, style: { transition: "stroke-dasharray var(--dur-slow) var(--ease-out), stroke var(--dur-base) var(--ease-out)" } })
      ] }),
      /* @__PURE__ */ jsxs103("div", { style: { position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }, children: [
        /* @__PURE__ */ jsx141("span", { style: { fontSize: size * 0.24, fontWeight: 800, color: "var(--label-strong)", fontVariantNumeric: "tabular-nums", lineHeight: 1 }, children: Math.round(value) }),
        unit && /* @__PURE__ */ jsx141("span", { style: { fontSize: size * 0.11, fontWeight: 600, color: "var(--label-alternative)", marginTop: 2 }, children: unit })
      ] })
    ] }),
    label != null && /* @__PURE__ */ jsx141("span", { style: { fontSize: 12, fontWeight: 600, color: "var(--label-alternative)", wordBreak: "keep-all", textAlign: "center" }, children: label })
  ] });
}

// components/viz/VideoStreamTile.jsx
import React144 from "react";
import { jsx as jsx142, jsxs as jsxs104 } from "react/jsx-runtime";
function usePulseKeyframes() {
  React144.useEffect(() => {
    if (typeof document === "undefined" || document.getElementById("lk-stream-kf")) return;
    const el = document.createElement("style");
    el.id = "lk-stream-kf";
    el.textContent = "@keyframes lk-stream-pulse{0%,100%{opacity:1}50%{opacity:.3}}@keyframes lk-stream-spin{to{transform:rotate(360deg)}}";
    document.head.appendChild(el);
  }, []);
}
function VideoStreamTile({ children, label, status = "live", aspectRatio = "16 / 9", style, ...rest }) {
  usePulseKeyframes();
  const showHud = label != null;
  return /* @__PURE__ */ jsxs104(
    "div",
    {
      style: {
        position: "relative",
        width: "100%",
        aspectRatio,
        borderRadius: "var(--radius-lg)",
        overflow: "hidden",
        background: "var(--surface-inverse)",
        border: "1px solid var(--border-subtle)",
        fontFamily: "var(--font-sans)",
        ...style
      },
      ...rest,
      children: [
        children,
        showHud && /* @__PURE__ */ jsxs104(React144.Fragment, { children: [
          /* @__PURE__ */ jsx142("div", { style: {
            position: "absolute",
            left: 0,
            top: 0,
            right: 0,
            height: 52,
            pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(8,8,8,0.5), transparent)"
          } }),
          /* @__PURE__ */ jsxs104("div", { style: { position: "absolute", left: 12, top: 12, display: "flex", alignItems: "center", gap: 7, pointerEvents: "none" }, children: [
            status === "live" && /* @__PURE__ */ jsx142("span", { style: {
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "var(--bw-red)",
              flexShrink: 0,
              animation: "lk-stream-pulse 1.4s var(--ease-in-out) infinite"
            } }),
            /* @__PURE__ */ jsx142("span", { style: {
              fontSize: 12,
              fontWeight: 800,
              letterSpacing: "1px",
              textTransform: "uppercase",
              color: "var(--text-on-inverse)",
              opacity: 0.9
            }, children: label })
          ] })
        ] }),
        status === "loading" && /* @__PURE__ */ jsx142("div", { style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(8,14,33,0.45)"
        }, children: /* @__PURE__ */ jsx142("span", { style: { width: 30, height: 30, borderRadius: "50%", border: "3px solid rgba(255,255,255,0.22)", borderTopColor: "var(--lk-accent)", animation: "lk-stream-spin 0.8s linear infinite" } }) }),
        status === "disconnected" && /* @__PURE__ */ jsxs104("div", { style: {
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          gap: 8,
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(8,14,33,0.72)",
          color: "rgba(255,255,255,0.55)",
          fontSize: 13,
          fontWeight: 600,
          whiteSpace: "nowrap"
        }, children: [
          /* @__PURE__ */ jsxs104("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.8", strokeLinecap: "round", strokeLinejoin: "round", "aria-hidden": "true", children: [
            /* @__PURE__ */ jsx142("path", { d: "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
            /* @__PURE__ */ jsx142("path", { d: "M12 9v4" }),
            /* @__PURE__ */ jsx142("path", { d: "M12 17h.01" })
          ] }),
          "\uC5F0\uACB0 \uB04A\uAE40"
        ] })
      ]
    }
  );
}

// components/viz/ViewerToolbar.jsx
import React145 from "react";
import { jsx as jsx143 } from "react/jsx-runtime";
function ViewerToolbar({ children, orientation = "vertical", style, ...rest }) {
  return /* @__PURE__ */ jsx143("div", { style: {
    display: "inline-flex",
    flexDirection: orientation === "vertical" ? "column" : "row",
    gap: 2,
    padding: 4,
    background: "var(--surface-raised)",
    border: "1px solid var(--border-subtle)",
    borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-md)",
    ...style
  }, ...rest, children });
}
function ViewerToolbarButton({ children, active = false, label, style, ...rest }) {
  return /* @__PURE__ */ jsx143(
    "button",
    {
      type: "button",
      "aria-label": label,
      title: label,
      style: {
        width: 34,
        height: 34,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        border: 0,
        borderRadius: "var(--radius-sm)",
        cursor: "pointer",
        background: active ? "var(--lk-accent-tint)" : "transparent",
        color: active ? "var(--lk-accent-ink)" : "var(--label-neutral)",
        transition: "background var(--dur-fast) var(--ease-out)",
        ...style
      },
      ...rest,
      children
    }
  );
}
export {
  Accordion,
  Alert,
  Anchor,
  AspectRatio,
  AutoComplete,
  Avatar,
  AvatarGroup,
  BRAND_LOGO_NAMES,
  Badge,
  Banner,
  BarChart,
  Blockquote,
  Bookmark,
  BottomNav,
  BrandLogo,
  Breadcrumb,
  Bubble,
  Button,
  ButtonGroup,
  Calendar,
  Callout,
  CanvasEditorShell,
  Card,
  Carousel,
  Center,
  Checkbox,
  CheckboxGroup,
  ChecklistItem,
  Chip,
  ChoiceCard,
  CircularProgress,
  Cluster,
  Code,
  Col,
  Collapsible,
  ColorSwatch,
  Columns,
  Combobox,
  CommandPalette,
  ConnectionBadge,
  Container,
  ContentBadge,
  CopyButton,
  DataGrid,
  DatePicker,
  DescriptionList,
  Dimmer,
  Divider,
  DonutChart,
  Drawer,
  DropdownMenu,
  EditorToolbar,
  EmptyState,
  EquipmentStatusCard,
  Fab,
  FeatureCard,
  FileUpload,
  FilterChip,
  FloorSelector,
  Footer,
  FormField,
  Grid,
  HistoryToolbar,
  HoverCard,
  ICON_NAMES,
  Icon,
  IconButton,
  Input,
  InputGroup,
  Joystick,
  Kbd,
  Lightbox,
  Link,
  ListCell,
  Lockup,
  Map2DCanvas,
  Menubar,
  Meter,
  MetricCard,
  Modal,
  MultiSelectChip,
  NavRail,
  NewsCard,
  Notification,
  NumberField,
  Overline,
  Pagination,
  PasswordInput,
  PinInput,
  Popover,
  ProductCard,
  ProgressBar,
  PushBadge,
  Radio,
  RadioGroup,
  RangeSlider,
  Rating,
  RobotStatusCard,
  Scene3DFrame,
  ScrollArea,
  SearchField,
  Section,
  SegmentedControl,
  Select,
  Sheet,
  SideNav,
  Skeleton,
  Slider,
  SocialButton,
  SourceTag,
  Spacer,
  Sparkline,
  SpecRow,
  Spinner,
  Split,
  SplitButton,
  Stack,
  Stat,
  StatusBadge,
  StepList,
  Stepper,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  TagInput,
  TelemetryGauge,
  TextButton,
  Textarea,
  ThemeToggle,
  Thumbnail,
  TimePicker,
  Timeline,
  Toast,
  ToastStack,
  ToggleButton,
  Toolbar,
  Tooltip,
  TopBar,
  TopBarNavItem,
  TopicTree,
  Tree,
  UserMenu,
  VideoStreamTile,
  ViewerToolbar,
  ViewerToolbarButton,
  VisuallyHidden,
  Wizard
};
//# sourceMappingURL=index.js.map