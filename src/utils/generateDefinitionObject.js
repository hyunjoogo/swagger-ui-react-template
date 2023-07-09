// response에 key가 $ref이면
// definition[$ref의 값]으로 접근을 한다.
// 해당 $ref의 값안에 $ref가 있을 수 있다.

// 1. definition의 key(이하 responseName)마다 빈 객체를 생성하는 객체(이하 defObj)를 생성한다.
// 2. responseName 객체를 돌면서 key의 value의 type에 따라 defObj[responseName][key]에 대입한다.
// 3. type이 없고 key의 이름이 $ref이면 그 자리에 defObj[responseName]를 call by reference를 한다.
// 4. type이 'array'일 때 items 안에 $ref가 있으면 2,3번을 재귀한다.

export function generateDefinitionObject(json) {
  const defObj = {};
  for (let modelName in json.definitions) {
    defObj[modelName] = {};
  }

  for (let modelName in json.definitions) {
    const model_properties = json.definitions[modelName].properties;

    for (let property_name in model_properties) {
      const property_value = model_properties[property_name]; // properties의 키의 값
      generateDataType(property_value, defObj, modelName, property_name);
    }
  }
  return defObj;
}

function generateDataType(
  property_value,
  defObj,
  modelName,
  property_name,
  isItem = false
) {
  if (property_value.type === "string") {
    if (property_value.example) {
      defObj[modelName][property_name] = property_value.example;
    } else {
      defObj[modelName][property_name] = isItem ? ["string"] : "string";
    }
  }
  if (property_value.type === "integer") {
    if (property_value.example) {
      defObj[modelName][property_name] = property_value.example;
    } else {
      defObj[modelName][property_name] = isItem ? [0] : 0;
    }
  }
  if (property_value.type === "boolean") {
    if (property_value.example) {
      defObj[modelName][property_name] = property_value.example;
    } else {
      defObj[modelName][property_name] = isItem ? [true] : true;
    }
  }
  if (property_value.type === "number") {
    if (property_value.example) {
      defObj[modelName][property_name] = property_value.example;
    } else {
      defObj[modelName][property_name] = isItem ? [0.1] : 0.1;
    }
  }
  if (property_value.type === "array") {
    if (property_value.example) {
      defObj[modelName][property_name] = property_value.example;
    } else {
      generateDataType(
        property_value.items,
        defObj,
        modelName,
        property_name,
        true
      );
    }
  }
  if (!property_value.type) {
    if (property_value["$ref"]) {
      const def_name = property_value["$ref"].slice(14); //
      defObj[modelName][property_name] = isItem
        ? [defObj[def_name]]
        : defObj[def_name];
    }
  }
}
