import React from "react";
import numeral from "numeral";
import "./Table.css";

function Table({ countries, casesType, ...props }) {
  return (
    <div className="table">
      <table>
        <tbody>
          {countries.map(
            ({ country, countryInfo, cases, recovered, deaths }, index) => (
              <tr key={index} onClick={() => props.onClick(country)}>
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
            )
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
