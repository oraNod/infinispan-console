import * as React from 'react';
import { useEffect, useState } from 'react';
import dataContainerService from '../../services/dataContainerService';
import {
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  PageSection,
  PageSectionVariants,
  Tab,
  Tabs,
  Text,
  TextContent,
  TextVariants,
  Title,
  Toolbar,
  ToolbarGroup,
  ToolbarItem,
  Tooltip,
  TooltipPosition
} from '@patternfly/react-core';
import {
  CubesIcon,
  ErrorCircleOIcon,
  InProgressIcon,
  OffIcon,
  OkIcon,
  OutlinedQuestionCircleIcon
} from '@patternfly/react-icons';
import displayUtils from '../../services/displayUtils';
import tasksService from '../../services/tasksService';
import countersService from '../../services/countersService';
import { CacheTableDisplay } from '@app/CacheManagers/CacheTableDisplay';
import { CounterTableDisplay } from '@app/CacheManagers/CounterTableDisplay';
import { TasksTableDisplay } from '@app/CacheManagers/TasksTableDisplay';

const CacheManagers = () => {
  const [cm, setCacheManager] = useState<undefined | CacheManager>(undefined);
  const [activeTabKey, setActiveTabKey] = useState(0);
  const [caches, setCaches] = useState<CacheInfo[]>([]);
  const [counters, setCounters] = useState<Counter[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    dataContainerService.getCacheManagers().then(cacheManagers => {
      if (cacheManagers.length > 0) {
        setCacheManager(cacheManagers[0]);
        dataContainerService
          .getCaches(cacheManagers[0].name)
          .then(caches => setCaches(caches));
      }
    });
  }, []);

  useEffect(() => {
    tasksService.getTasks().then(tasks => setTasks(tasks));
  }, []);

  useEffect(() => {
    countersService.getCounters().then(counters => setCounters(counters));
  }, []);

  const handleTabClick = (event, tabIndex) => {
    setActiveTabKey(tabIndex);
  };

  const DisplayTabs = () => {
    return (
      <Tabs isFilled activeKey={activeTabKey} onSelect={handleTabClick}>
        <Tab
          eventKey={0}
          title={
            <>
              <strong>{caches.length}</strong> Caches
            </>
          }
        >
          <CacheTableDisplay caches={caches} cacheManager={cm} />
        </Tab>
        <Tab
          eventKey={1}
          title={
            <>
              <strong>{counters.length}</strong> Counters
            </>
          }
        >
          <CounterTableDisplay counters={counters} cacheManager={cm} />
        </Tab>
        <Tab
          eventKey={2}
          title={
            <>
              <strong>{tasks.length}</strong> Tasks
            </>
          }
        >
          <TasksTableDisplay tasks={tasks} cacheManager={cm} />
        </Tab>
      </Tabs>
    );
  };

  const DisplayCacheManager = () => {
    if (cm === undefined) {
      return (
        <EmptyState variant={EmptyStateVariant.full}>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h5" size="lg">
            Data container
          </Title>
          <EmptyStateBody>The data container is empty</EmptyStateBody>
        </EmptyState>
      );
    }

    return <DisplayTabs />;
  };

  const DisplayStatusIcon = (props: { status: string }) => {
    let icon;
    switch (props.status) {
      case 'STOPPING':
        icon = <OffIcon />;
        break;
      case 'RUNNING':
        icon = <OkIcon />;
        break;
      case 'INSTANTIATED':
        icon = <OkIcon />;
        break;
      case 'INITIALIZING':
        icon = <InProgressIcon />;
        break;
      case 'FAILED':
        icon = <ErrorCircleOIcon />;
        break;
      case 'TERMINATED':
        icon = <OffIcon />;
        break;
      default:
        icon = <OkIcon />;
    }

    return icon;
  };

  let title = 'Data container is empty';
  let status = '';
  let localSiteName = '';
  if (cm !== undefined) {
    title = displayUtils.capitalize(cm.name);
    status = cm.cache_manager_status;
    localSiteName = cm.local_site ? '| Site ' + cm.local_site : '';
  }

  const DisplayCacheManagerHeader = () => {
    return (
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component={TextVariants.h1}>
            Data container - {title}
            <Tooltip
              position={TooltipPosition.top}
              content={<div>Data container name</div>}
            >
              <OutlinedQuestionCircleIcon style={{ paddingLeft: 10 }} />
            </Tooltip>
          </Text>
        </TextContent>
        <Toolbar>
          <ToolbarGroup>
            <ToolbarItem>
              <TextContent>
                <Text
                  component={TextVariants.h3}
                  style={{
                    paddingRight: 10,
                    color: displayUtils.statusColor(status, true)
                  }}
                >
                  <DisplayStatusIcon status={status} />
                </Text>
              </TextContent>
            </ToolbarItem>
            <ToolbarItem>
              <TextContent>
                <Text
                  component={TextVariants.h3}
                  style={{
                    paddingRight: 10,
                    fontWeight: 'bolder',
                    color: displayUtils.statusColor(status, false)
                  }}
                >
                  {displayUtils.capitalize(status)}
                </Text>
              </TextContent>
            </ToolbarItem>
            <ToolbarItem>
              <TextContent>
                <Text component={TextVariants.h3}>{localSiteName}</Text>
              </TextContent>
            </ToolbarItem>
          </ToolbarGroup>
        </Toolbar>
      </PageSection>
    );
  };
  return (
    <React.Fragment>
      <DisplayCacheManagerHeader />
      <PageSection variant={PageSectionVariants.light}>
        <DisplayCacheManager />
      </PageSection>
    </React.Fragment>
  );
};

export { CacheManagers };
