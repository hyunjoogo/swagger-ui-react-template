import React, { useContext, useEffect, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { transDepsToArray } from '../../utils/transDepsToArray';

const UseTags = () => {
  const { apiData, apiName } = useContext(AppContext);
  const [navList, setNavList] = useState([]);

  useEffect(() => {
    const tags = apiData.tags;
    let tempArray = [];

    // 그룹 => 카테고리 => 섹션
    // 그룹 => 카테고리
    tags.forEach((tag) => {
      const tagDeps = transDepsToArray(tag.name);

      // 그룹이 없으면 => 그룹 생성
      if (!tempArray.find((item) => item.title === tagDeps[0])) {
        // 섹션이 없는 카테고리일 때 => 그룹 children에 섹션없는 카테고리만 추가
        if (tagDeps.length === 1) {
          tempArray.push({
            title: tagDeps[0],
            name: tag.name,
            description: tag.description,
            href: `/${apiName}/${tagDeps[0]}`,
          });
        } else if (tagDeps.length === 2) {
          tempArray.push({
            title: tagDeps[0], // 그룹 타이틀
            children: [
              {
                title: tagDeps[1], // 카테고리 타이틀
                name: tag.name,
                description: tag.description,
                href: `/${apiName}/${tagDeps[0]}/${tagDeps[1]}`,
              },
            ],
          });
        } else {
          // 섹션이 있는 카테고리일 때 => 그룹 children의 카테고리 내부에 섹션 children(grand) 생성
          tempArray.push({
            title: tagDeps[0], // 그룹 타이틀
            children: [
              {
                title: tagDeps[1], // 카테고리 타이틀
                children: [
                  // children(grand)
                  {
                    title: tagDeps[2], // 섹션 타이틀
                    name: tag.name,
                    description: tag.description,
                    href: `/${apiName}/${tagDeps[0]}/${tagDeps[1]}/${tagDeps[2]}`,
                  },
                ],
              },
            ],
          });
        }
      }
      // 그룹이 있으면 => 그룹의 인덱스를 찾아서 그룹 children에 삽입
      else {
        const groupIdx = tempArray.findIndex(
          (group) => group.title === tagDeps[0]
        );
        // 섹션이 없는 카테고리일 때 => 그룹의 인덱스를 찾아서 children에 삽입
        if (tagDeps.length === 2) {
          tempArray[groupIdx].children.push({
            title: tagDeps[1],
            name: tag.name,
            description: tag.description,
            href: `/${apiName}/${tagDeps[0]}/${tagDeps[1]}`,
          });
        }
        // 섹션이 있는 카테고리일 때 => 그룹의 인덱스를 찾는다 => 카테고리 children의 인덱스를 찾는다
        else {
          const categoryIdx = tempArray[groupIdx].children.findIndex(
            (category) => category.title === tagDeps[1]
          );
          // 카테고리 children이 존재하지 않으면 새로 생성
          if (categoryIdx === -1) {
            tempArray[groupIdx].children.push({
              title: tagDeps[1],
              children: [
                {
                  title: tagDeps[2],
                  name: tag.name,
                  description: tag.description,
                  href: `/${apiName}/${tagDeps[0]}/${tagDeps[1]}/${tagDeps[2]}`,
                },
              ],
            });
          } else {
            tempArray[groupIdx].children[categoryIdx].children.push({
              title: tagDeps[2],
              name: tag.name,
              description: tag.description,
              href: `/${apiName}/${tagDeps[0]}/${tagDeps[1]}/${tagDeps[2]}`,
            });
          }
        }
      }
    });
    setNavList(tempArray);
  }, []);

  return navList;
};

export default UseTags;
