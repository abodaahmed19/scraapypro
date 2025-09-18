import User from '@/store/User'

// Import icons
import SellProductIcon from '@/assets/svg-icons/burger-menu/product.svg?component'
import RentOutIcon from '@/assets/svg-icons/burger-menu/rent.svg?component'
import ProvideServiceIcon from '@/assets/svg-icons/burger-menu/service.svg?component'
import VendorApprovalIcon from '@/assets/svg-icons/burger-menu/vendorApprovals.svg?component'
import ListingRequestsIcon from '@/assets/svg-icons/burger-menu/listingApprovals.svg?component'
import BankTransferIcon from '@/assets/svg-icons/management/banktranfer.svg?component'
import SalesAnalysisIcon from '@/assets/svg-icons/contract.svg?component'

import AccountIcon from '@/assets/svg-icons/account_icon.svg'
import SettingsIcon from '@/assets/svg-icons/settings_icon.svg'
import BillingIcon from '@/assets/svg-icons/billing_icon.svg'
import ContractIcon from '@/assets/svg-icons/contract.svg'
import ReportsIcon from '@/assets/svg-icons/reports_icon.svg'
import MyListingIcon from '@/assets/svg-icons/my_listing_icon.svg'
import SellingIcon from '@/assets/svg-icons/selling_icon.svg'
import PurchasingIcon from '@/assets/svg-icons/cart_icon.svg'
import FilialIcon from '@/assets/svg-icons/filial.svg?component'

import NotificationIcon from '@/assets/svg-icons/notification_icon.svg'
import ProductIcon from '@/assets/svg-icons/product_icon.svg'
import RentIcon from '@/assets/svg-icons/rent_icon.svg'
import ServicesIcon from '@/assets/svg-icons/services_icon.svg'
import categoryRequestIcon from '@/assets/svg-icons/listings/categoryIcon.vue'
import legalInformationIcon from '@/assets/svg-icons/listings/legalInformationIcon.vue'
import OrderIcon from '@/assets/svg-icons/order_icon.svg'
import InspectionsIcon from '@/assets/svg-icons/inspections_icon.svg'
import PendingInspectionsIcon from '@/assets/svg-icons/pending-icon.svg'
import InspectionsHistoryIcon from '@/assets/svg-icons/history_icon.svg'
import MessagesIcon from '@/assets/svg-icons/messages1.svg'
import WalletIcon from '@/assets/svg-icons/wallet.svg?component'

// Import pages
import SettingsPage from '@/views/management/SettingsPage.vue'
import BillingsView from '@/views/BillingsView.vue'
import DocumentsView from '@/views/DocumentsView.vue'
import SellProductPage from '@/views/management/vendor/SellProductPage.vue'
import rentalListing from '@/views/management/vendor/rentalListing.vue'
import ServiceListings from '@/views/management/vendor/ServiceListings.vue'
import NotificationsPage from '@/views/management/NotificationsPage.vue'
import VendorApprovalPage from '@/views/management/staff/VendorApprovalPage.vue'
import ListingsRequestsPage from '@/views/management/staff/ListingRequestsPage.vue'
import RentalRequestsPage from '@/views/management/staff/RentalRequestsPage.vue'
import ServiceRequestsPage from '@/views/management/staff/ServiceRequestsPage.vue'
import CategoryRequestsPage from '@/views/management/staff/CategoryRequestsPage.vue'
import legalInformation from '@/views/management/legalInformation.vue'
import VehicleSpecs from '@/views/management/staff/VehicleSpecs.vue'
import AddDriviers from '@/views/management/vendor/AddDriviers.vue'
import OrderManagementPage from "@/views/management/staff/OrderManagementPage.vue"
import PendingInspectionsPage from "@/views/management/vendor/inspections/Pending.vue"
import InspectionsHistoryPage from "@/views/management/vendor/inspections/History.vue"
import SendToUsPage from '@/views/management/staff/sendto_us.vue'
import InvoicePurchase from '@/views/invoice_purchase.vue'
import SalesAnalysis from '@/views/management/staff/SalesAnalysis.vue'
import InvoicePurchases from '@/views/invoice_purchases.vue'

import ListingView from '@/views/management/history/ListingView.vue'
import savedAddress from '@/components/legalInformation/address.vue'
import ContractManagement from '@/views/ContractManagement.vue'
import WalletComponent from '@/components/Wallet.vue'
import TransfertBankPage from '@/views/management/staff/Transfert_bank.vue'
import AddFilial from '@/views/management/vendor/AddFilial.vue'


// ---- Section templates ----
const myListing = {
  key: 'MyListings',
  title: 'listings.MyListings',
  icon: MyListingIcon,
  components: {
    'sell-product': {
      title: 'listings.sellProducts',
      icon: ProductIcon,
      component: SellProductPage
    },
    'rental-listings': {
      title: 'listings.rentalListing',
      icon: RentIcon,
      component: rentalListing
    },
    'service-listings': {
      title: 'listings.ServiceListings',
      icon: ServicesIcon,
      component: ServiceListings
    }
  }
}

const listingRequests = {
  key: 'listing-requests',
  title: 'listings.requests',
  icon: ListingRequestsIcon,
  components: {
    product: {
      title: 'listings.productListings',
      icon: SellProductIcon,
      component: ListingsRequestsPage
    },
    rental: {
      title: 'listings.rentalListings',
      icon: RentOutIcon,
      component: RentalRequestsPage
    },
    service: {
      title: 'listings.serviceListings',
      icon: ProvideServiceIcon,
      component: ServiceRequestsPage
    }
  }
}

const selling = {
  key: 'Selling',
  title: 'listings.Selling',
  icon: SellingIcon,
  components: {
    'products-sold': {
      title: 'listings.products_sold',
      icon: ProductIcon,
      component: ListingView
    },
    'rented-out': {
      title: 'listings.rentedOut',
      icon: RentIcon,
      component: ListingView
    },
    'services-provided': {
      title: 'listings.provideService',
      icon: ServicesIcon,
      component: ListingView
    }
  }
}

const purchasing = {
  key: 'Purchasing',
  title: 'listings.Purchasing',
  icon: PurchasingIcon,
  components: {
    'products-bought': {
      title: 'listings.products_bought',
      icon: ProductIcon,
      component: ListingView
    },
    'rented-in': {
      title: 'listings.rented_in',
      icon: RentIcon,
      component: ListingView
    },
    'services-availed': {
      title: 'listings.services_availed',
      icon: ServicesIcon,
      component: ListingView
    }
  }
}

const inspections = {
  key: 'Inspections',
  title: 'listings.Inspections',
  icon: InspectionsIcon,
  components: {
    pending: {
      title: 'listings.PendingInspections',
      icon: PendingInspectionsIcon,
      component: PendingInspectionsPage
    },
    history: {
      title: 'listings.InspectionsHistory',
      icon: InspectionsHistoryIcon,
      component: InspectionsHistoryPage
    }
  }
}

// ---- Pages builder ----
export function usePages() {
  const pages = []

  // Section account pour les non-staff
  if (!User.getters.isStaff) {
    pages.push({
      items: [
        {
          key: 'Account',
          title: 'listings.Account',
          icon: AccountIcon,
          components: {
            settings: {
              title: 'listings.settings',
              icon: SettingsIcon,
              component: SettingsPage
            },
            wallet: {
              title: 'listings.Wallet',
              icon: WalletIcon,
              component: WalletComponent
            }
          }
        }
      ]
    })
  }

  // Section Business
  if (User.getters.hasBusinessProfile) {
    if (!User.getters.isStaff) {
      pages[0].items[0].components.legalInformation = {
        title: 'listings.legalInformation',
        icon: legalInformationIcon,
        component: legalInformation
      }
      pages[0].items[0].components.savedAddress = {
        title: 'legalInformation.savedAddress',
        icon: legalInformationIcon,
        component: savedAddress
      }
    }

    pages.push({
      items: [
        {
          key: 'Billing',
          title: 'listings.billing',
          icon: BillingIcon,
          component: BillingsView
        },
        {
          key: 'Reports',
          title: 'listings.reports',
          icon: ReportsIcon,
          component: DocumentsView
        },
        {
          key: 'Contracts',
          title: 'العقود',
          icon: ContractIcon,
          components: {
            create: {
              title: 'انشاء عقد',
              icon: ContractIcon,
              component: ContractManagement
            }
          }
        },
         {
      key: 'Filials',
      title: 'فروع',
      icon: FilialIcon,
      component: AddFilial
    }
      ]
    })

    pages.push(
      { items: [myListing] },
      { items: [inspections] },
      { items: [selling, purchasing] },
      {
        items: [
          {
            key: 'Notifications',
            title: 'listings.Notifications',
            icon: NotificationIcon,
            component: NotificationsPage
          },
          {
            key: 'Logistics',
            title: 'listings.Logistics',
            icon: RentIcon,
            component: AddDriviers
          }
        ]
      }
    )
  }

  // Section staff
  if (User.getters.isStaff) {
    pages.push({
      items: [
        {
          key: 'vendor-approval',
          title: 'vendor.approval',
          icon: VendorApprovalIcon,
          component: VendorApprovalPage
        },
        listingRequests,
        {
          key: 'category-requests',
          title: 'listings.categoryRequests',
          icon: categoryRequestIcon,
          component: CategoryRequestsPage
        },
        {
          key: 'VehicleSpecs-requests',
          title: 'listings.VehicleSpecs',
          icon: categoryRequestIcon,
          component: VehicleSpecs
        },
        {
          key: 'messages',
          title: 'listings.messages',
          icon: MessagesIcon,
          component: SendToUsPage
        },
        {
          key: 'order-management',
          title: 'listings.orderManagement',
          icon: OrderIcon,
          component: OrderManagementPage
        },
        {
          key: 'purchase-invoices',
          title: 'فواتير شراء',
          icon: PurchasingIcon,
          component: InvoicePurchase
        },
         {
        key: 'purchase-invoices-bahed',
        title: 'فواتير البيع الموجهة لباهض',
        icon: PurchasingIcon, // même icône que فاتورة الشراء
        component: InvoicePurchases
      },
        {
  key: 'bank-transfer',
  title: 'طلبات تحويل بنكي',
  icon: BankTransferIcon,
  component: TransfertBankPage
},
{
  key: 'sales-analysis',
  title: 'تحليل المبيعات',
  icon: SalesAnalysisIcon,
  component: SalesAnalysis
},

      ]
    })
  }

  return pages
}
