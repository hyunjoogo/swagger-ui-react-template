# swagger-ui-react-template
이 템플릿은 Swagger.json을 이쁘게 만드는 템플릿입니다.

# Usage
****
```
npm install
npm start
```

# Config Setting
****
`/src/const/config.js`의 값을 변경하여 사용할 수 있습니다.   
domains 객체에 domain 객체를 추가하여 여러개의 도메인의 API를 관리할 수 있습니다.

```javascript
const CONFIG = {
  domains: {
    petstore: {
      url: "https://petstore.swagger.io/", // swagger.json을 받을 수 있는 URL
      pathname: "petstore", // www.domain.com/"pathname"
      selectName: "Petstore API", // select 박스에 표시될 이름
    },
  },
  delimiter: "|",
  defaultDomain: "petstore",
  defaultSiteDomain: "http://localhost:3000", // 기본 URL. 마지막에 '/' 붙이지 말 것
};
```

# 사용 Library
- tailwindui template
