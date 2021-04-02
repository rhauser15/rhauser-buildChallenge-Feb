
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { Breadcrumb } from '@themesberg/react-bootstrap';

import { PageTrafficTable, RankingTable } from "../../components/Tables";


export default () => {
  return (
    <>
      <div className="d-xl-flex justify-content-between flex-wrap flex-md-nowrap align-items-center py-4">
        <div className="d-block mb-4 mb-xl-0">
          <Breadcrumb className="d-none d-md-inline-block" listProps={{ className: "breadcrumb-dark breadcrumb-transparent" }}>
            <Breadcrumb.Item><FontAwesomeIcon icon={faHome} /></Breadcrumb.Item>
            <Breadcrumb.Item>Tables</Breadcrumb.Item>
            <Breadcrumb.Item active>Customer Outreach Database</Breadcrumb.Item>
          </Breadcrumb>
          
          
          
          <iframe class="airtable-embed" src="https://airtable.com/embed/shrEROPmFVCbzBF7A?backgroundColor=yellow" frameborder="0" align="center" onmousewheel="" width="150%" height="800" ></iframe>
        </div>
      </div>

      
    </>
  );
};
