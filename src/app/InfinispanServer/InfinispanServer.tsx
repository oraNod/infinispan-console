import * as React from 'react';
import {useState} from 'react';
import {Button, PageSection, Title,} from '@patternfly/react-core';
import {useEffect} from "react";
import {Link} from "react-router-dom";
import {CatalogIcon} from "@patternfly/react-icons";

const InfinispanServer: React.FunctionComponent<any> = (props) => {
  return (
    <PageSection>
      <Title size="lg">Infinispan Server version  </Title>
      <Link to={{pathname: 'container/'}}> <Button variant="link" icon={<CatalogIcon/>}>Console </Button>{' '}</Link>
    </PageSection>
  );
}

export {InfinispanServer};
