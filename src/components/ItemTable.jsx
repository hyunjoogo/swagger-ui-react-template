import React from "react";

const ItemTable = ({
  tableData = [],
  tableName,
  headers = ["name", "type", "required", "description"],
  scopedSlots = {},
}) => {
  return (
    <>
      <h3>{tableName}</h3>
      <table>
        <thead>
          <tr>
            {headers.map((header) => {
              let width;
              if (header === "name") {
                width = 200;
              }
              if (header === "type" || header === "required") {
                width = 100;
              }

              return (
                <th key={header} width={width} className="capitalize">
                  {header}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, index) => {
            return (
              <tr key={index}>
                {headers.map((key, index) => {
                  if (scopedSlots[key]) {
                    return React.cloneElement(scopedSlots[key](row), {
                      key: index,
                    });
                  }

                  if (key === "required") {
                    return <td key={index}>{row[key] ? "O" : null}</td>;
                  }
                  return <td key={index}>{row[key]}</td>;
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );
};

export default ItemTable;
