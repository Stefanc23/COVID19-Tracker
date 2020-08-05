import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table({ countries, casesType, ...props }) {
  return (
    <div className="table">
      {countries.map(({ country, countryInfo, cases, recovered, deaths }) => (
        <tr onClick={() => props.onClick(country)}>
          <td>
            <img src={countryInfo.flag} alt={`${country} flag`}></img>
            {country}
          </td>
          <td>
            <strong>
              {numeral(
                casesType === "cases"
                  ? cases
                  : casesType === "recovered"
                  ? recovered
                  : deaths
              ).format()}
            </strong>
          </td>
        </tr>
      ))}
    </div>
  );
}

export default Table;
