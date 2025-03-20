import { Table } from "@mantine/core";
import Link from "next/link";
import { useMemo } from "react";
import { TNotificationLog } from "../types";
import dayjs from 'dayjs';
import { useViewportSize } from "@mantine/hooks";

export default function SignalLog(props: { logsData: TNotificationLog[], reload: () => Promise<any> }) {
  const { height, width } = useViewportSize();
  const isDesktop = height > 450 &&width > 510;    
  const rows = useMemo(() => {
    return !props.logsData 
    ? [] 
    : props.logsData.map(l => (
      <Table.Tr key={l.id}>
        <Table.Td fz='xs'>{dayjs(l.sentAt).format('YYYY-MM-DD HH:mm:ss')}</Table.Td>
        <Table.Td fz='xs'>{l.title}</Table.Td>
        <Table.Td fz='xs'>{l.message}</Table.Td>
      </Table.Tr>
    ));
  }, [props.logsData]); 
      
  return (
    <Table 
      mt={60}
      striped 
      withTableBorder 
      stickyHeader 
      stickyHeaderOffset={ isDesktop? 60: 10 }
      maw={640}
    >
      <Table.Thead style={{backgroundColor: 'orange'}} >
        <Table.Tr>
          <Table.Th>Sent at</Table.Th>
          <Table.Th>Job</Table.Th>
          <Table.Th>Message</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{ rows }</Table.Tbody>
      <Table.Caption>
        <Link 
          href='' 
          prefetch={false}
          onClick={() => props.reload()}
          style={{ 
            color: 'red', 
            fontSize: '14px', 
            fontWeight: 'bold' 
          }}
          >
          Reload the logs
        </Link>
      </Table.Caption>
    </Table>
  );
}
