import { useMemo } from 'react';
// import { AgGridReact } from 'ag-grid-react';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';
// import { GetRowIdFunc, GetRowIdParams, GridReadyEvent, GridApi } from 'ag-grid-community';
// import { LightstreamerClient, Subscription, ConsoleLogLevel, ConsoleLoggerProvider, ItemUpdate, StatusWidget } from 'lightstreamer-client-web/lightstreamer.esm';
var ls = require("lightstreamer-client");

// interface StockItem {
//   stock_name: string;
//   last_price: number;
//   time: string;
//   change: number;
//   bid_quantity: number;
//   bid: number;
//   offer: number;
//   ask_quantity: number;
//   min: number;
//   max: number;
//   ref_price: number;
//   open_price: number;
// }

interface StockItem { 
    EPIC: string,
    BID: number,
    OFFER: number,
    CHANGE: number,
    UPDATE_TIME: string,
};
/** 
class LsClient {

  // itemNames = ['item1', 'item2', 'item3', 'item4', 'item5', 'item6', 'item7', 'item8', 'item9', 'item10'];
  // fieldNames = ['stock_name', 'last_price', 'time', 'pct_change', 'bid_quantity', 'bid', 'ask', 'ask_quantity', 'min', 'max', 'ref_price', 'open_price'];
  itemNames = [ 
    'MARKET:IX.D.SPTRD.IFG.IP',
    'MARKET:IX.D.DOW.IFG.IP',
    'MARKET:IX.D.HANGSENG.IFG.IP', 
    'MARKET:IX.D.NIKKEI.IFG.IP',
    'MARKET:CS.D.CFIGOLD.CFI.IP',
    'MARKET:CS.D.CFISILVER.CFI.IP',
    'MARKET:CC.D.CL.UMG.IP'
  ];
  fieldNames = ['BID', 'OFFER', 'CHANGE', 'UPDATE_TIME'];
  client;
  // For accessing the Grid's API
  gridApi!: GridApi<StockItem>;

  constructor() {
    // ls.LightstreamerClient.setLoggerProvider(new ConsoleLoggerProvider(ConsoleLogLevel.WARN));
    // creates a subscription
    var sub = new ls.Subscription('MERGE', this.itemNames, this.fieldNames);
    sub.setDataAdapter('DEFAULT');
    sub.setRequestedSnapshot('yes');
    //  sub.setDataAdapter('QUOTE_ADAPTER');
    sub.addListener(this);
    // subscribes to the stock items
    // this.client = new ls.LightstreamerClient((document.location.protocol === 'https:' ? 'https' : 'http') + '://push.lightstreamer.com', 'DEMO');
    this.client = new ls.LightstreamerClient('https://apd.marketdatasystems.com', 'Prod');
    const cst = '4dafa514fee54c1947441f5a382ec1ddff5bb45204b66ed5e1ef907e4d5d77CC01111';
    const xst = '559379cf1c819080dcfef039d12bfd6119376ee4d4606d7a45bcf644bb7027CD01111';
    this.client.connectionDetails.setUser('LZTXH');
    this.client.connectionDetails.setPassword('CST-' + cst + '|XST-' + xst);
    this.client.connectionDetails.setAdapterSet('DEFAULT');
    
    this.client.subscribe(sub);
    // registers the StatusWidget
    // this.client.addListener(new ls.StatusWidget('left', '0px', true));
    this.client.addListener({
        onListenStart: function() {
          console.log('Lightstreamer client - start listening');
        },
        onStatusChange: function(status:any) {
          console.log('Lightstreamer connection status:' + status);
        },
        onServerError: function(errorCode: string, errorMessage: string) {
          console.log("Lightstreamer server error: " + errorCode + " - " + errorMessage);
        }
      });
  }

  connect(gridApi: GridApi<StockItem>) {
    this.gridApi = gridApi;
    this.client.connect();  
  }

  // callback for SubscriptionListener.onItemUpdate event
  onItemUpdate(update: any) {
    var item = this.getStockItem(update);
    var row = this.gridApi.getRowNode(item.EPIC);
    if (row) {
      this.gridApi.applyTransaction({update: [item]})
    } else {
      this.gridApi.applyTransaction({add: [item]});
    }
  }

  getStockItem(update: any): StockItem {
    var obj: any = {};
    obj['EPIC'] = update.getItemName();
    for (var f of this.fieldNames) {
      var val = update.getValue(f);
      if (f === 'UPDATE_TIME' || f === '') {
        obj[f] = val;
      } else {
        obj[f] = parseFloat(val);
      }
    }
    return obj;
  }
}
*/
export default function LiveStream() {
  // const containerStyle = useMemo(() => ({ width: '1060px', height: '333px' }), []);

  // const gridStyle = useMemo(() => ({ "--ag-font-size": '9px', height: '100%', width: '100%' }), []);

  // Each Column Definition results in one Column.
  // const columnDefs = useMemo( () => [
  //   { headerName: 'Name', field: 'stock_name', width: 130 },
  //   { headerName: 'Last', field: 'last_price', width: 80 },
  //   { headerName: 'Time', field: 'time', width: 90 },
  //   { headerName: 'Change', field: 'pct_change', width: 90 },
  //   { headerName: 'Bid Size', field: 'bid_quantity', width: 90 },
  //   { headerName: 'Bid', field: 'bid', width: 70 },
  //   { headerName: 'Ask', field: 'ask', width: 70 },
  //   { headerName: 'Ask Size', field: 'ask_quantity', width: 100 },
  //   { headerName: 'Min', field: 'min', width: 80 },
  //   { headerName: 'Max', field: 'max', width: 80 },
  //   { headerName: 'Ref.', field: 'ref_price', width: 80 },
  //   { headerName: 'Open', field: 'open_price', width: 80 },
  // ], []);

  //   const columnDefs = useMemo( () => [
  //   { headerName: 'Name', field: 'EPIC', width: 200 },
  //   { headerName: 'Bid', field: 'BID', width: 70 },
  //   { headerName: 'Ask', field: 'OFFER', width: 70 },
  //   { headerName: 'Change', field: 'CHANGE', width: 70 },
  //   { headerName: 'update time', field: 'UPDATE_TIME', width: 80 },
  // ], []);

  // // DefaultColDef sets props common to all Columns
  // const defaultColDef = useMemo( ()=> ({
  //   sortable: true,
  //   filter: true,
  //   enableCellChangeFlash: true,
  //   resizable: true,
  // }), []);

  // // Callback that tells the grid to use the 'stock_name' attribute for IDs
  // const getRowId = useMemo<GetRowIdFunc>(() => {
  //   return (params: GetRowIdParams<StockItem>) => params.data.EPIC;
  // }, []);

  // const client: LsClient = new LsClient();

  // // callback for GridReadyEvent
  // const onGridReady = (params: GridReadyEvent<StockItem>) => {
  //   client.connect(params.api);
  // }

  return (
    <></>
    // <div style={containerStyle}>
    //   <div
    //     style={{
    //       height: '100%',
    //       width: '100%',
    //       display: 'flex',
    //       flexDirection: 'column',
    //     }}
    //   >
    //     <div style={{ flex: '1 1 0px' }}>
    //       <div style={gridStyle} className="ag-theme-alpine">
    //         <AgGridReact<StockItem>
    //           columnDefs={columnDefs} // Column Defs for Columns 
    //           defaultColDef={defaultColDef} // Default Column Properties 
    //           animateRows={true}
    //           getRowId={getRowId}
    //           onGridReady={onGridReady}
    //         ></AgGridReact>
    //       </div>
    //     </div>
    //   </div>
    // </div>
  );
}
