import Client from './js/client.js';

// ========== Preset ==========

const client = new Client(window.location.origin);

const sidebarMenu = document.querySelector('.sidebar-options-list');
const contentWrapper = document.querySelector('.content-wrapper');
const statusBlockList = document.querySelector('.status-block-list');
const wanForm = document.querySelector('.wan-block-form');

const menuOptions = [
   {
      element: sidebarMenu.querySelector('.sidebar-status'),
      option: 'status',
   },
   {
      element: sidebarMenu.querySelector('.sidebar-wan'),
      option: 'wan',
   },
   {
      element: sidebarMenu.querySelector('.sidebar-dhcp'),
      option: 'dhcp',
   },
   {
      element: sidebarMenu.querySelector('.sidebar-firmware'),
      option: 'firmware',
   },
];

menuOptions.forEach((item) => {
   item.element.addEventListener('click', (evt) => onClickSidebar(evt, item.option));
});
wanForm.addEventListener('submit', onWanSubmit);

// ========== Functions ==========

function onLoad() {
   const statusMenuOption = sidebarMenu.querySelector('.sidebar-status');
   const contentSections = contentWrapper.querySelectorAll('section');

   if (!statusMenuOption.classList.contains('active')) {
      statusMenuOption.classList.add('active');
   }

   contentSections.forEach((item) => {
      if (item.classList.contains('hidden-content')) {
         if (item.classList.contains('status-content')) {
            item.classList.remove('hidden-content');
         }
      } else {
         if (!item.classList.contains('status-content')) {
            item.classList.add('hidden-content');
         }
      }
   });

   fetchStatus();
}

function onClickSidebar(evt, option) {
   const { target } = evt;

   const currentActiveMenuOption = sidebarMenu.querySelector('.active');
   const currentActiveContent = contentWrapper.querySelector('section:not(.hidden-content)');
   const contentToShow = contentWrapper.querySelector(`.${option}-content`);

   if (currentActiveMenuOption) {
      currentActiveMenuOption.classList.remove('active');
      target.classList.add('active');
   }

   if (currentActiveContent) {
      currentActiveContent.classList.add('hidden-content');
   }

   if (contentToShow) {
      contentToShow.classList.remove('hidden-content');
   }

   if (option === 'status') {
      fetchStatus();
   }

   if (option === 'wan') {
      updateWANSettings();
   }
}

function onWanSubmit(evt) {
   evt.preventDefault();
   const formElements = evt.target.elements;

   try {
      const resp = client.sendWANSettings({
         connection_type: formElements.wan_connection.value,
         ip_address: formElements.ip_address.value,
         subnet_mask: formElements.subnet_mask.value,
         gateway: formElements.gateway.value,
         primary_dns: formElements.primary_dns.value,
         secondary_dns: formElements.secondary_dns.value,
      });
      console.log(resp);
   } catch (error) {
      console.error('Error sending WAN settings:', error);
   }
}

function fetchStatus() {
   try {
      const status = client.getStatus();
      statusBlockList.querySelector('.status-version .status-block-item-value').textContent = status.firmware_version;
      statusBlockList.querySelector('.status-ip .status-block-item-value').textContent = status.ip_address;
      statusBlockList.querySelector('.status-connection .status-block-item-value').textContent = status.connection;
      statusBlockList.querySelector('.status-model .status-block-item-value').textContent = status.model;
      statusBlockList.querySelector('.status-internet .status-block-item-value').textContent = status.internet;
      statusBlockList.querySelector('.status-rx .status-block-item-value').textContent = status.rx;
      statusBlockList.querySelector('.status-tx .status-block-item-value').textContent = status.tx;
   } catch (error) {
      console.error('Error fetching status:', error);
   }
}

function updateWANSettings() {
   try {
      const status = client.getWANStatus();
      wanForm.getElementById('wan_connection').value = status.connection_type;
      wanForm.getElementById('ip_address').value = status.ip_address;
      wanForm.getElementById('subnet_mask').value = status.subnet_mask;
      wanForm.getElementById('gateway').value = status.gateway;
      wanForm.getElementById('primary_dns').value = status.primary_dns;
      wanForm.getElementById('secondary_dns').value = status.secondary_dns;
   } catch (error) {
      console.error('Error fetching WAN settings:', error);
   }
}

// ========== Load Preset ==========

onLoad();
