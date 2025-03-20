import { memo, useState, useMemo } from 'react';
import { Table } from '@mantine/core';
import { TQuote } from '@/types/TQuote';
import { useViewportSize } from '@mantine/hooks';

type TProductQuote = TQuote & {
  product: string
}

const defaultRows: TProductQuote[] = [
  { product: 'NQ100',  epic: 'MARKET:IX.D.NASDAQ.IFG.IP',    bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'SP500',  epic: 'MARKET:IX.D.SPTRD.IFG.IP',     bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'DOW',    epic: 'MARKET:IX.D.DOW.IFG.IP',       bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'HSI',    epic: 'MARKET:IX.D.HANGSENG.IFG.IP',  bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'NIKKEI', epic: 'MARKET:IX.D.NIKKEI.IFG.IP',    bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'GOLD',   epic: 'MARKET:CS.D.CFIGOLD.CFI.IP',   bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'SILVER', epic: 'MARKET:CS.D.CFISILVER.CFI.IP', bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'WTI',    epic: 'MARKET:CC.D.CL.UMG.IP',        bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'EURUSD', epic: 'MARKET:CS.D.EURUSD.CSM.IP',    bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'USDJPY', epic: 'MARKET:CS.D.USDJPY.CSM.IP',    bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'GBPUSD', epic: 'MARKET:CS.D.GBPUSD.CSM.IP',    bid: 0, offer: 0, change: 0, updateTime: ''},
  { product: 'AUDUSD', epic: 'MARKET:CS.D.AUDUSD.CSM.IP',    bid: 0, offer: 0, change: 0, updateTime: ''},
];

type QuotationTableProps = {
  quote: TQuote | undefined,
}

function QuotationTable(props: QuotationTableProps) {
  const { height, width } = useViewportSize();
  const isDesktop = height > 450 &&width > 510;    
  const [rows, setRows] = useState<TProductQuote[]>(defaultRows);
  const [lastUpdate, setLastUpdate] = useState("");

  const updateLatestQuote = useMemo(() => {
    const updatedRows = rows.map(row => {
      if (props.quote && row.epic === props.quote.epic) {
        row.bid = props.quote.bid;
        row.offer = props.quote.offer;
        row.change = props.quote.change;
        row.updateTime = props.quote.updateTime;
      }
      setLastUpdate(row.updateTime); 
      return row;
    });
    setRows(updatedRows);
    
  }, [props.quote]);
  
  
  const tableRows = useMemo(() => {
    return rows.map((row) => {
      return (
        <Table.Tr key={row.product} >
          <Table.Td>{row.product}</Table.Td>
          <Table.Td style={{textAlign: 'right'}}>
            { row.bid }
          </Table.Td>
          <Table.Td style={{textAlign: 'right'}}>
            { row.offer }
          </Table.Td>
          <Table.Td style={{textAlign: 'right'}}  c={row.change < 0? 'red' :'teal'}>
            { row.change }
          </Table.Td>
          {/* <Table.Td style={{textAlign: 'right'}}>
            { row.updateTime }
          </Table.Td> */}
        </Table.Tr>
      ) 
    });
  }, [rows]);

  return (
    <Table striped withTableBorder 
      captionSide='top' 
      stickyHeader stickyHeaderOffset={ isDesktop? 60: 10 }
      maw={640}
    >
      <Table.Caption>Price Quotation last update [London] time: {lastUpdate}</Table.Caption>
      <Table.Thead style={{backgroundColor: 'orange'}}>
        <Table.Tr>
          <Table.Th>Product</Table.Th>
          <Table.Th style={{textAlign: 'right'}}>Bid</Table.Th>
          <Table.Th style={{textAlign: 'right'}}>Offer</Table.Th>
          <Table.Th style={{textAlign: 'right'}}>Change</Table.Th>
          {/* <Table.Th style={{textAlign: 'right'}}>Update Time</Table.Th> */}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {tableRows}
      </Table.Tbody>
    </Table>
  );
}


export default memo(QuotationTable);