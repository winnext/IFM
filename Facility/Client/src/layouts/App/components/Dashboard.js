import React, { useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import ProductService from '../service/ProductService';

const ordersChart = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'New',
      data: [2, 7, 20, 9, 16, 9, 5],
      backgroundColor: ['rgba(100, 181, 246, 0.2)'],
      borderColor: ['#64B5F6'],
      borderWidth: 3,
      fill: true,
      tension: 0.4,
    },
  ],
};

const ordersChartOptions = {
  maintainAspectRatio: false,
  aspectRatio: 0.8,
  plugins: {
    legend: {
      display: true,
    },
  },
  responsive: true,
  hover: {
    mode: 'index',
  },
  scales: {
    y: {
      ticks: {
        min: 0,
        max: 20,
      },
    },
  },
};

const revenueChart = {
  labels: ['Direct', 'Promoted', 'Affiliate'],
  datasets: [
    {
      data: [40, 35, 25],
      backgroundColor: ['#64B5F6', '#7986CB', '#4DB6AC'],
    },
  ],
};

const Dashboard = () => {
  const orderWeek = [
    { name: 'This Week', code: '0' },
    { name: 'Last Week', code: '1' },
  ];

  const [selectedOrderWeek, setSelectedOrderWeek] = useState(orderWeek[0]);
  const [products, setProducts] = useState(null);
  const [productsThisWeek, setProductsThisWeek] = useState(null);
  const [productsLastWeek, setProductsLastWeek] = useState(null);

  const items = [
    {
      label: 'Shipments',
      items: [
        { label: 'Tracker', icon: 'pi pi-compass' },
        { label: 'Map', icon: 'pi pi-map-marker' },
        { label: 'Manage', icon: 'pi pi-pencil' },
      ],
    },
  ];

  const menuRef = useRef(null);
  const chartRef = useRef(null);

  useEffect(() => {
    const productService = new ProductService();
    productService.getProducts().then((data) => setProducts(data));
    productService.getProducts().then((data) => setProductsThisWeek(data));
    productService.getProductsMixed().then((data) => setProductsLastWeek(data));
  }, []);

  const changeDataset = (event) => {
    const dataSet = [
      [2, 7, 20, 9, 16, 9, 5],
      [2, 4, 9, 20, 16, 12, 20],
      [2, 17, 7, 15, 4, 20, 8],
      [2, 2, 20, 4, 17, 16, 20],
    ];

    ordersChart.datasets[0].data =
      dataSet[parseInt(event.currentTarget.getAttribute('data-index'))];
    ordersChart.datasets[0].label =
      event.currentTarget.getAttribute('data-label');
    ordersChart.datasets[0].borderColor =
      event.currentTarget.getAttribute('data-stroke');
    ordersChart.datasets[0].backgroundColor =
      event.currentTarget.getAttribute('data-fill');
  };

  const recentSales = (event) => {
    if (event.value.code === '0') {
      setProducts(productsThisWeek);
    } else {
      setProducts(productsLastWeek);
    }

    setSelectedOrderWeek(event.value);
  };

  const menuToggle = (event) => {
    menuRef.current.toggle(event);
  };

  const refreshDataset = (event) => {
    chartRef.current.reinit(event);
  };

  const formatCurrency = (value) => {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  };

  const onOrderTabClick = (event) => {
    changeDataset(event);
    refreshDataset(event);
  };

  const bodyTemplate = (data, props) => {
    return (
      <>
        <span className="p-column-title">{props.header}</span>
        {data[props.field]}
      </>
    );
  };

  const statusBodyTemplate = (data) => {
    return (
      <>
        <span className="p-column-title">Status</span>
        <span
          className={`product-badge status-${data.inventoryStatus.toLowerCase()}`}
        >
          {data.inventoryStatus}
        </span>
      </>
    );
  };

  const priceBodyTemplate = (data) => {
    return (
      <>
        <span className="p-column-title">Price</span>
        {formatCurrency(data.price)}
      </>
    );
  };

  return (
    <div className="layout-dashboard">
      <div className="grid">
        <div className="col-12 md:col-6 xl:col-3">
          <div className="card grid-nogutter widget-overview-box widget-overview-box-1">
            <span className="overview-icon">
              <i className="pi pi-shopping-cart"></i>
            </span>
            <span className="overview-title">Orders</span>
            <div className="grid overview-detail">
              <div className="col-6">
                <div className="overview-number">640</div>
                <div className="overview-subtext">Pending</div>
              </div>
              <div className="col-6">
                <div className="overview-number">1420</div>
                <div className="overview-subtext">Completed</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 xl:col-3">
          <div className="card grid-nogutter widget-overview-box widget-overview-box-2">
            <span className="overview-icon">
              <i className="pi pi-dollar"></i>
            </span>
            <span className="overview-title">Revenue</span>
            <div className="grid overview-detail">
              <div className="col-6">
                <div className="overview-number">$2,100</div>
                <div className="overview-subtext">Expenses</div>
              </div>
              <div className="col-6">
                <div className="overview-number">$9,640</div>
                <div className="overview-subtext">Income</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 xl:col-3">
          <div className="card grid-nogutter widget-overview-box widget-overview-box-3">
            <span className="overview-icon">
              <i className="pi pi-users"></i>
            </span>
            <span className="overview-title">Customers</span>
            <div className="grid overview-detail">
              <div className="col-6">
                <div className="overview-number">8272</div>
                <div className="overview-subtext">Active</div>
              </div>
              <div className="col-6">
                <div className="overview-number">25402</div>
                <div className="overview-subtext">Registered</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 md:col-6 xl:col-3">
          <div className="card grid-nogutter widget-overview-box widget-overview-box-4">
            <span className="overview-icon">
              <i className="pi pi-comment"></i>
            </span>
            <span className="overview-title">Comments</span>
            <div className="grid overview-detail">
              <div className="col-6">
                <div className="overview-number">12</div>
                <div className="overview-subtext">New</div>
              </div>
              <div className="col-6">
                <div className="overview-number">85</div>
                <div className="overview-subtext">Responded</div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 xl:col-6">
          <div className="card grid-nogutter orders">
            <div className="card-header">
              <h4>Orders</h4>
              <Menu
                id="orders-button"
                popup
                model={items}
                ref={menuRef}
                appendTo={document.body}
              ></Menu>
              <Button
                type="button"
                icon="pi pi-search"
                className="p-button-text p-button-secondary"
                onClick={menuToggle}
                aria-controls="orders-button"
                aria-haspopup="true"
              ></Button>
            </div>

            <div className="grid">
              <div className="col-12">
                <div id="order-tabs-container" className="grid order-tabs">
                  <div
                    className="order-tab order-tab-new col-6 md:col-3"
                    onClick={onOrderTabClick}
                    data-label="New Orders"
                    data-index="0"
                    data-stroke="#BBDEFB"
                    data-fill="rgba(100, 181, 246, 0.2)"
                  >
                    <i className="pi pi-plus-circle"></i>
                    <span className="order-label">New</span>
                    <i className="stat-detail-icon icon-arrow-right-circle"></i>
                    <img
                      src="assets/demo/images/dashboard/graph-new.svg"
                      alt="order"
                    />
                  </div>
                  <div
                    className="order-tab order-tab-completed col-6 md:col-3"
                    onClick={onOrderTabClick}
                    data-label="Completed Orders"
                    data-index="1"
                    data-stroke="#C5CAE9"
                    data-fill="rgba(121, 134, 203, 0.2)"
                  >
                    <i className="pi pi-check-circle"></i>
                    <span className="order-label">Completed</span>
                    <i className="stat-detail-icon icon-arrow-right-circle"></i>
                    <img
                      src="assets/demo/images/dashboard/graph-completed.svg"
                      alt="order"
                    />
                  </div>
                  <div
                    className="order-tab order-tab-refunded col-6 md:col-3"
                    onClick={onOrderTabClick}
                    data-label="Refunded Orders"
                    data-index="2"
                    data-stroke="#B2DFDB"
                    data-fill="rgba(224, 242, 241, 0.5)"
                  >
                    <i className="pi pi-refresh"></i>
                    <span className="order-label">Refunded</span>
                    <i className="stat-detail-icon icon-arrow-right-circle"></i>
                    <img
                      src="assets/demo/images/dashboard/graph-refunded.svg"
                      alt="order"
                    />
                  </div>
                  <div
                    className="order-tab order-tab-cancelled col-6 md:col-3"
                    onClick={onOrderTabClick}
                    data-label="Cancelled Orders"
                    data-index="3"
                    data-stroke="#B2EBF2"
                    data-fill="rgba(224, 247, 250, 0.5)"
                  >
                    <i className="pi pi-times-circle"></i>
                    <span className="order-label">Cancelled</span>
                    <i className="stat-detail-icon icon-arrow-right-circle"></i>
                    <img
                      src="assets/demo/images/dashboard/graph-cancelled.svg"
                      alt="order"
                    />
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="overview-chart">
                  <Chart
                    ref={chartRef}
                    type="line"
                    data={ordersChart}
                    options={ordersChartOptions}
                    id="order-chart"
                  ></Chart>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-12 xl:col-6">
          <div className="card">
            <div className="card-header">
              <h4>Recent Sales</h4>
              <Dropdown
                options={orderWeek}
                value={selectedOrderWeek}
                optionLabel="name"
                onChange={recentSales}
                className="dashbard-demo-dropdown"
              ></Dropdown>
            </div>

            <p>Your sales activity over time.</p>

            <DataTable
              value={products}
              paginator
              rows={5}
              className="p-datatable-products"
            >
              <Column
                field="id"
                header="ID"
                sortable
                body={bodyTemplate}
              ></Column>
              <Column
                field="category"
                header="Category"
                sortable
                body={bodyTemplate}
              ></Column>
              <Column
                field="price"
                header="Price"
                sortable
                body={priceBodyTemplate}
              ></Column>
              <Column
                field="inventoryStatus"
                header="Status"
                sortable
                body={statusBodyTemplate}
              ></Column>
              <Column
                bodyStyle={{ textAlign: 'center', justifyContent: 'center' }}
                body={() => <Button type="button" icon="pi pi-search"></Button>}
              ></Column>
            </DataTable>
          </div>
        </div>

        <div className="col-12 lg:col-4">
          <div className="card widget-tasks">
            <h4>Tasks</h4>
            <p>Overview of your pending tasks.</p>
            <div>
              <div className="task task-1">
                <div className="task-name">
                  <span>12 Orders</span> to fulfill
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-2">
                <div className="task-name">
                  <span>40+ Payments</span> to withdraw
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-3">
                <div className="task-name">
                  <span>4 Reports</span> to revise
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-4">
                <div className="task-name">
                  <span>6 Questions</span> to respond
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
              <div className="task task-5">
                <div className="task-name">
                  <span>2 Chargebacks</span> to review
                </div>
                <div className="task-progress">
                  <div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Best Sellers</h4>
            <p>Most popular products from your collection.</p>

            <ul className="widget-image-list">
              <li>
                <span>Product</span>
                <span>Sales</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/bamboo-watch.jpg"
                    alt="diamond-layout"
                  />
                  <span>Bamboo Watch</span>
                </span>
                <span className="listitem-value">82</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/blue-band.jpg"
                    alt="diamond-layout"
                  />
                  <span>Blue Band</span>
                </span>
                <span className="listitem-value">75</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/game-controller.jpg"
                    alt="diamond-layout"
                  />
                  <span>Game Controller</span>
                </span>
                <span className="listitem-value">64</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/lime-band.jpg"
                    alt="diamond-layout"
                  />
                  <span>Lime Band</span>
                </span>
                <span className="listitem-value">62</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/gold-phone-case.jpg"
                    alt="diamond-layout"
                  />
                  <span>Phone Case</span>
                </span>
                <span className="listitem-value">55</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/green-t-shirt.jpg"
                    alt="diamond-layout"
                  />
                  <span>Green T-Shirt</span>
                </span>
                <span className="listitem-value">48</span>
              </li>
              <li>
                <span>
                  <img
                    src="assets/demo/images/product/purple-t-shirt.jpg"
                    alt="diamond-layout"
                  />
                  <span>Purple T-Shirt</span>
                </span>
                <span className="listitem-value">32</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="col-12 lg:col-8">
          <div className="card revenue">
            <h4>Revenue Stream</h4>
            <p>Comparison of your revenue sources.</p>
            <div className="revenue-chart-container">
              <div className="flex justify-content-center">
                <Chart
                  style={{ position: 'relative', width: '50%' }}
                  type="pie"
                  id="revenue-chart"
                  data={revenueChart}
                ></Chart>
              </div>
            </div>
          </div>

          <div className="card">
            <h4>Team Members</h4>
            <ul className="widget-person-list">
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/amyelsner.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Amy Elsner</div>
                    <div className="person-subtext">Accounting</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/annafali.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Anna Fali</div>
                    <div className="person-subtext">Procurement</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/bernardodominic.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Bernardo Dominic</div>
                    <div className="person-subtext">Finance</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/ivanmagalhaes.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Ivan Magalhaes</div>
                    <div className="person-subtext">Sales</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
              <li>
                <div className="person-item">
                  <img
                    src="assets/demo/images/avatar/xuxuefeng.png"
                    alt="diamond-layout"
                  />
                  <div className="person-info">
                    <div className="person-name">Xuxue Feng</div>
                    <div className="person-subtext">Management</div>
                  </div>
                </div>
                <div className="person-actions">
                  <Button
                    type="button"
                    className="p-button-rounded p-button-success"
                    icon="pi pi-envelope"
                  ></Button>
                  <Button
                    type="button"
                    className="p-button-rounded p-button-warning"
                    icon="pi pi-cog"
                  ></Button>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default React.memo(Dashboard);
