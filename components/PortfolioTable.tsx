import { Box, Stack, Table, Text } from '@mantine/core';
// import { 
//   LightstreamerClient, 
//   Subscription, 
//   ItemUpdate, 
//   StatusWidget 
// } from 'lightstreamer-client-web';
const data = [
  {product: 'DOW', date: '2024-04-02', priceLevel: 40000, orderSize: -2, winloss: 0, status: 'OPEN'},
  {product: 'DOW', date: '2024-04-04', priceLevel: 39500, orderSize: 1, winloss: 500, status: 'PARTIAL CLOSE'},
  {product: 'DOW', date: '2024-04-05', priceLevel: 40400, orderSize: 1, winloss: -400, status: 'CLOSE'},
  {product: 'HSI', date: '2024-04-03', priceLevel: 17000, orderSize: -5, winloss: 0, status: 'OPEN'},
  {product: 'HSI', date: '2024-04-03', priceLevel: 16760, orderSize: 2, winloss: 480, status: 'PARTIAL CLOSE'},
  {product: 'WTI', date: '2024-04-05', priceLevel: 85, orderSize: -500, winloss: 0, status: 'OPEN'},
  {product: 'HSI', date: '2024-04-05', priceLevel: 85.9, orderSize: 500, winloss: -450, status: 'CLOSE'},
];

export default function PortfolioTable () {

  const rows = data.map( (element) => (
    <Table.Tr key={element.product} >
      <Table.Td>{element.product}</Table.Td>
      <Table.Td >{element.date}</Table.Td>
      <Table.Td style={{textAlign: 'right'}}>{element.priceLevel}</Table.Td>
      <Table.Td style={{textAlign: 'right'}} 
        c={element.orderSize < 0? 'red' :'teal'}
      >{element.orderSize}</Table.Td>
      <Table.Td style={{textAlign: 'right'}}
        c={element.winloss < 0? 'red' :'teal'}
      >${element.winloss}</Table.Td>
      <Table.Td
      >{element.status}</Table.Td>
    </Table.Tr>
  ));

  return (
    <Box><Stack>
      <Text ta='center' fw={500} c='blue'>Last update:  {new Date().toLocaleString() + ''}</Text>
      <Table striped withTableBorder 
        captionSide='top' 
        stickyHeader stickyHeaderOffset={100}
      >
        <Table.Caption>Portfolio quotation is delayed by 15min </Table.Caption>
        <Table.Thead style={{backgroundColor : 'orange'}}><Table.Tr>
          <Table.Th>Product</Table.Th>
          <Table.Th >Date</Table.Th>
          <Table.Th style={{textAlign: 'right'}} >Price level</Table.Th>
          <Table.Th style={{textAlign: 'right'}} >Size</Table.Th>
          <Table.Th style={{textAlign: 'right'}} >+ / -</Table.Th>
          <Table.Th >Status</Table.Th>
        </Table.Tr></Table.Thead>
        <Table.Tbody>
          {rows}
          <Table.Tr>
            <Table.Td style={{textAlign: 'right'}} colSpan={4}>This Week Running Win/Loss: </Table.Td>
            <Table.Td style={{textAlign: 'right'}} c={'teal'} >$130</Table.Td>
            <Table.Td></Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Td>HSI</Table.Td>
            <Table.Td>2024-04-08</Table.Td>
            
            <Table.Td style={{textAlign: 'right'}}>17000 </Table.Td>
            <Table.Td style={{textAlign: 'right'}}>-3</Table.Td>
            <Table.Td style={{textAlign: 'right'}}></Table.Td>
            <Table.Td>CF</Table.Td>
          </Table.Tr>
        </Table.Tbody>
      </Table>
    </Stack></Box>
  );
}