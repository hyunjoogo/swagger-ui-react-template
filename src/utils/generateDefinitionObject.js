// response에 key가 $ref이면
// definition[$ref의 값]으로 접근을 한다.
// 해당 $ref의 값안에 $ref가 있을 수 있다.

// 1. definition의 key(이하 responseName)마다 빈 객체를 생성하는 객체(이하 defObj)를 생성한다.
// 2. responseName 객체를 돌면서 key의 value의 type에 따라 defObj[responseName][key]에 대입한다.
// 3. type이 없고 key의 이름이 $ref이면 그 자리에 defObj[responseName]를 call by reference를 한다.
// 4. type이 'array'일 때 items 안에 $ref가 있으면 2,3번을 재귀한다.

export function generateDefinitionObject(json) {
  const defObj = {};
  Object.keys(json.definitions).forEach((def) => {
    defObj[def] = {};
  });
  for (let definition in json.definitions) {
    const def_properties = json.definitions[definition].properties;
    // console.log(def_properties); // properties 객체를 표현
    for (let property_key in def_properties) {
      const property_key_value = def_properties[property_key]; // properties의 키의 값
      changeExample(property_key_value, defObj, definition, property_key);
      // console.log(property_key); // properties의 key 이름들
    }
  }
  return defObj;
}

function changeExample(key, defObj, definition, property_key, isItem = false) {
  // key는 property_key_value
  if (key.type === 'string') {
    if (key.example) {
      defObj[definition][property_key] = key.example;
    } else {
      defObj[definition][property_key] = isItem ? ['string'] : 'string';
    }
  }
  if (key.type === 'integer') {
    if (key.example) {
      defObj[definition][property_key] = key.example;
    } else {
      defObj[definition][property_key] = isItem ? [0] : 0;
    }
  }
  if (key.type === 'boolean') {
    if (key.example) {
      defObj[definition][property_key] = key.example;
    } else {
      defObj[definition][property_key] = isItem ? [true] : true;
    }
  }
  if (key.type === 'number') {
    if (key.example) {
      defObj[definition][property_key] = key.example;
    } else {
      defObj[definition][property_key] = isItem ? [0.1] : 0.1;
    }
  }
  if (key.type === 'array') {
    if (key.example) {
      defObj[definition][property_key] = key.example;
    } else {
      changeExample(key.items, defObj, definition, property_key, true);
    }
  }
  if (!key.type) {
    if (key['$ref']) {
      const def_name = key['$ref'].slice(14); //
      defObj[definition][property_key] = isItem
        ? [defObj[def_name]]
        : defObj[def_name];
    }
  }
}
