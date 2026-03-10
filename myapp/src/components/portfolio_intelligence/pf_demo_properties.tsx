import React, { useEffect, useState } from "react";
import axios from "axios";
import { ChevronRight } from "lucide-react";

import "./pf_demo_properties.css";

export type PropertyRecord = {
  property_name: string;
  submarket: string;
  region: string;
  address: string;
  location: string;
  class_type: string;
  units: number | string;
  occupancy: string;
  rent_per_sqft: string;
  property_response: unknown;
};

type PfDemoPropertiesProps = {
  onSelectProperty?: (property: Pick<PropertyRecord, "property_name" | "submarket" | "region">) => void;
};

const getRowKey = (row: PropertyRecord) => `${row.property_name}-${row.submarket}-${row.region}`;

const PfDemoProperties: React.FC<PfDemoPropertiesProps> = ({ onSelectProperty }) => {
  const [data, setData] = useState<PropertyRecord[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    let isActive = true;

    const load = async () => {
      setStatus("loading");
      try {
        const response = await axios.post<{ data: PropertyRecord[] }>(
          `${API_URL}/api/get_property_model_data/`,
          { fetch: "all" }
        );

        if (isActive) {
          setData(response.data?.data ?? []);
          setStatus("idle");
        }
      } catch (error) {
        if (isActive) {
          setStatus("error");
        }
      }
    };

    load();
    return () => {
      isActive = false;
    };
  }, [API_URL]);

  const rows = data;

  const handleRowClick = (row: PropertyRecord) => {
    if (onSelectProperty) {
      onSelectProperty({
        property_name: row.property_name,
        submarket: row.submarket,
        region: row.region,
      });
    }
  };

  const handleRowKeyDown = (event: React.KeyboardEvent<HTMLTableRowElement>, row: PropertyRecord) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleRowClick(row);
    }
  };

  const renderState = (message: string, tone: "neutral" | "error") => (
    <div className={`pf-properties__state ${tone === "error" ? "pf-properties__state--error" : ""}`}>
      {message}
    </div>
  );

  return (
    <section className="pf-properties">
      {/* <div className="pf-properties__topbar" /> */}

      <div className="pf-properties__hero">
        <div className="pf-properties__hero-inner">
          <h1 className="pf-properties__title">Property Intelligence</h1>
        </div>
      </div>

      <div className="pf-properties__body">
        <div className="pf-properties__table-shell">
          <table className="pf-properties__table">
            <thead className="pf-properties__head">
              <tr>
                <th scope="col">Property</th>
                <th scope="col">Location</th>
                <th scope="col">Class</th>
                <th scope="col">Units</th>
                <th scope="col">Occupancy</th>
                <th scope="col">Rent/sqft</th>
                <th scope="col">
                  <span className="sr-only">Open</span>
                </th>
              </tr>
            </thead>

            <tbody>
              {status === "loading" ? (
                <tr>
                  <td colSpan={7} className="pf-properties__state-cell">
                    {renderState("Loading...", "neutral")}
                  </td>
                </tr>
              ) : null}

              {status === "error" ? (
                <tr>
                  <td colSpan={7} className="pf-properties__state-cell">
                    {renderState("Failed to load properties.", "error")}
                  </td>
                </tr>
              ) : null}

              {status === "idle" && rows.length === 0 ? (
                <tr>
                  <td colSpan={7} className="pf-properties__state-cell">
                    {renderState("No properties available.", "neutral")}
                  </td>
                </tr>
              ) : null}

              {status === "idle"
                ? rows.map((row) => {
                    const rowKey = getRowKey(row);

                    return (
                      <tr
                        key={rowKey}
                        tabIndex={0}
                        role="button"
                        className="pf-properties__body-row"
                        onClick={() => handleRowClick(row)}
                        onKeyDown={(event) => handleRowKeyDown(event, row)}
                      >
                        <td className="pf-properties__cell pf-properties__cell--first">
                          <span className="pf-properties__property">{row.property_name || "-"}</span>
                        </td>
                        <td className="pf-properties__cell">
                          <span className="pf-properties__value">{row.location || "-"}</span>
                        </td>
                        <td className="pf-properties__cell">
                          <span className="pf-properties__value">{row.class_type || "-"}</span>
                        </td>
                        <td className="pf-properties__cell">
                          <span className="pf-properties__value">{row.units || "-"}</span>
                        </td>
                        <td className="pf-properties__cell">
                          <span className="pf-properties__value">{row.occupancy || "-"}</span>
                        </td>
                        <td className="pf-properties__cell">
                          <span className="pf-properties__value">{row.rent_per_sqft || "-"}</span>
                        </td>
                        <td className="pf-properties__cell pf-properties__cell--last pf-properties__arrow-cell">
                          <ChevronRight className="pf-properties__arrow" strokeWidth={2.6} />
                        </td>
                      </tr>
                    );
                  })
                : null}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};

export default PfDemoProperties;
