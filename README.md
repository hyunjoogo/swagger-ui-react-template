# swagger-ui-react-template
Swagge.json에 디자인과 기능을 추가한 템플릿입니다.  

## 주요 기능

### 검색기능 강화
브라우저의 검색기능이 아닌 Ctrl(mac은 command) + K로 검색할 수 있습니다.   
검색 후 키보드로 이동 후 Enter 또는 키보드로 선택시 해당 결과로 이동합니다.   
검색은 summary or path 입니다.

<img alt="Search_motion" height="300" src="/Users/hyunjoo/cording/swagger-ui-react-template/search.gif" title="Search_motion" width="300"/>

### 주소 복사 기능
summary 기준으로 주소 복사 및 이동이 가능합니다.

<img alt="Copy_motion" height="300" src="/Users/hyunjoo/cording/swagger-ui-react-template/copy.gif" title="Copy_motion" width="450"/>

### summary 기준 sideBar
summary 기준으로 사이드바가 생성되었습니다. 클릭시 해당 summary로 이동합니다.

<img alt="side_nav" height="300" src="/Users/hyunjoo/cording/swagger-ui-react-template/sideNav.png" title="side_nav" width="800"/>



### 
> 현재 v2 기준으로 지원되고 있습니다.   
> v3 업데이트를 위해 노력하겠습니다. 🙇

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
      url: "https://petstore.swagger.io/v2/swagger.json", // swagger.json을 받을 수 있는 URL
      pathname: "petstore", // www.domain.com/"pathname"
      selectName: "Petstore API", // select 박스에 표시될 이름
    },
  },
  // tags 객체의 name을 나누는 기준입니다.
  delimiter: "|",
  // Header에 아이콘을 눌렀을 때 이동하는 도메인입니다. ex)" www.domain.com/petstore"
  defaultDomain: "petstore",
  // 기본 URL. Summary를 복사에 사용됩니다. 마지막에 '/' 붙이지 마세요.
  defaultSiteDomain: "https://swagger-ui-react-template.netlify.app",
};
```

# 사용 Library
- tailwindui template
