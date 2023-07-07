/**
 * @config
 * @key api_name
 * @value {
 *  url : swagger.json이 내려오는 주소
 *  pathname: www.domain.com/"pathname"
 *  selectName: select 박스에 표시될 이름
 */

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
};

export default CONFIG;
