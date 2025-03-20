import { Table } from '@mantine/core';
import dayjs from 'dayjs';
import { getDecimalPlaces, displayNumber } from '@/utils/number';

type Props = {
  data: {
    product: string,
    low: number | null,
    high: number | null,
    axial: number | null,
    startPeriod: Date,
    endPeriod: Date,
  }[],
};

export default function ForecastTable(props: Props) {

  const startDate = props.data?.length> 0 ? dayjs(props!.data![0].startPeriod).format('YYYY-MM-DD') : '';
  const endDate = props.data?.length> 0 ? dayjs(props!.data![0].endPeriod).format('YYYY-MM-DD') : '';
  const rows = props.data.map( (entry) => (
    <Table.Tr key={entry.product} >
      <Table.Td>{entry.product}</Table.Td>
      <Table.Td style={{textAlign: 'right'}}>
        { displayNumber(entry.low, getDecimalPlaces(entry.product)) }
        {/* { entry.low } */}
      </Table.Td>
      <Table.Td style={{textAlign: 'right'}}>
        { displayNumber(entry.high, getDecimalPlaces(entry.product)) }
        {/* { entry.high } */}
      </Table.Td>
      <Table.Td style={{textAlign: 'right'}}>
        { displayNumber(entry.axial, getDecimalPlaces(entry.product)) }
        {/* { entry.axial } */}
      </Table.Td>
    </Table.Tr>
  ));

  return (
    <Table striped withTableBorder 
      captionSide='top' 
      stickyHeader stickyHeaderOffset={100}
      maw={640}
    >
      <Table.Caption>Forecast for the week: {startDate} to {endDate} </Table.Caption>
      <Table.Thead style={{backgroundColor: 'orange'}}><Table.Tr>
        <Table.Th>Product</Table.Th>
        <Table.Th style={{textAlign: 'right'}}>Low</Table.Th>
        <Table.Th style={{textAlign: 'right'}}>High</Table.Th>
        <Table.Th style={{textAlign: 'right'}}>Axial</Table.Th>
      </Table.Tr></Table.Thead>

      <Table.Tbody>
        {rows}
      </Table.Tbody>
    </Table>
  );
}