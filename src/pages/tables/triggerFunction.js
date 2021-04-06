
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
          <h4>Trigger Customer Feedback Survey.</h4>
          <p className="mb-0">
            Survey will automatically run daily at 12PM MST daily. Press button below to trigger manually. 
            <br></br>
            <br></br>
            <iframe name="votar" style={{height: 0}}></iframe>
            <form action="https://buildchallengeplaceholder-6271.twil.io/provision" method="POST" target="votar">
                
                  <button>Start Customer Survey</button>
            
              </form>
          </p>
          
          
        </div>
      </div>

      
    </>
  );
};
