import { useEffect, useState } from "react";
import axios from "axios";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";

type Artwork = {
  id: number;
  title: string;
  place_of_origin: string;
  artist_display: string;
  inscriptions: string;
  date_start: number;
  date_end: number;
};

export default function ArtTable() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState<Artwork[]>([]);
  const pageSize = 12;

  const fetchData = async (page: number) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `https://api.artic.edu/api/v1/artworks?page=${page}`
      );
      setArtworks(response.data.data);
      setTotalRecords(response.data.pagination.total);
      setCurrentPage(page);
      console.log(currentPage)
    } catch (error) {
      console.error("API Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(1);
  }, []);

  const handlePageChange = (e: any) => {
    fetchData(e.page + 1);}

  const handleSelectionChange = (e: DataTableSelectionChangeEvent) => {
    const newSelected: Artwork[] = e.value;

    
    const previousSelections = selectedRows.filter(
      (row) => !artworks.some((a) => a.id === row.id)
    );

    
    setSelectedRows([...previousSelections, ...newSelected]);
  };

  return (
    <div className="card">
      <h2>Fetched Data</h2>
      <DataTable
        value={artworks}
        lazy
        paginator
        rows={pageSize}
          first={(currentPage - 1) * pageSize}
        totalRecords={totalRecords}
        loading={loading}
        onPage={handlePageChange}
        dataKey="id"
        selection={artworks.filter((a) =>
          selectedRows.some((s) => s.id === a.id)
        )}
        onSelectionChange={handleSelectionChange}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
}
