'use client';

import { Transition } from '@headlessui/react';
import React, { useState } from 'react';

import { IconButton } from '@/components/IconButton';
import { FilesTab } from '@/components/Settings/FilesTab';
import { Icon, Tabs, Text } from '@/components/Shared';
import { SETTINGS_DRAWER_ID } from '@/constants';
import { useCitationsStore, useSettingsStore } from '@/stores';
import { cn } from '@/utils';

/**
 * @description Renders the settings drawer of the main content.
 * It opens up on top of the citation panel/the main content.
 */
export const SettingsDrawer: React.FC = () => {
  const [selectedTabIndex, setSelectedTabIndex] = useState(0);

  const {
    settings: { isConfigDrawerOpen },
    setSettings,
  } = useSettingsStore();
  const {
    citations: { hasCitations },
  } = useCitationsStore();

  const tabs = [{ name: 'Files', component: <FilesTab /> }];

  return (
    <Transition
      as="section"
      show={isConfigDrawerOpen}
      className={cn(
        'absolute right-0 z-configuration-drawer',
        'flex h-full flex-col',
        'w-full md:max-w-drawer lg:max-w-drawer-lg',
        'rounded-lg md:rounded-l-none',
        'bg-marble-1000 md:shadow-drawer',
        'border border-marble-950',
        { 'xl:border-l-0': hasCitations }
      )}
      enter="transition-transform ease-in-out duration-200"
      enterFrom="translate-x-full"
      enterTo="translate-x-0"
      leave="transition-transform ease-in-out duration-200"
      leaveFrom="translate-x-0"
      leaveTo="translate-x-full"
    >
      <header className="flex h-header items-center gap-2 border-b border-marble-950 p-5">
        <IconButton
          iconName="close-drawer"
          tooltip={{ label: 'Close drawer', size: 'md' }}
          onClick={() => setSettings({ isConfigDrawerOpen: false })}
        />
        <span className="flex items-center gap-2">
          <Icon name="settings" className="text-volcanic-400" kind="outline" />
          <Text styleAs="p-lg">Settings</Text>
        </span>
      </header>

      <section id={SETTINGS_DRAWER_ID} className="h-full w-full overflow-y-auto rounded-b-lg">
        {tabs.length === 1 ? (
          <div className="pt-5">{tabs[0].component}</div>
        ) : (
          <Tabs
            tabs={tabs.map((t) => t.name)}
            selectedIndex={selectedTabIndex}
            onChange={setSelectedTabIndex}
            tabGroupClassName="h-full"
            tabClassName="pt-2.5"
            panelsClassName="pt-7 lg:pt-7 px-0 flex flex-col rounded-b-lg bg-marble-1000 md:rounded-b-none"
            fitTabsContent
          >
            {tabs.map((t) => (
              <div key={t.name} className="h-full w-full">
                {t.component}
              </div>
            ))}
          </Tabs>
        )}
      </section>
    </Transition>
  );
};
