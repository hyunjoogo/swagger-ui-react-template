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

export default CONFIG;
