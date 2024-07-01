import { useSearchParams } from "react-router-dom"
import Spinner from "../../ui/Spinner"
import CabinRow from "./CabinRow"
import { useCabins } from "./useCabins"
import Table from "../../ui/Table"
import { CabinType } from "../../types"
import Menus from "../../ui/Menus"
import Empty from "../../ui/Empty"

function CabinTable() {
  const { isPending, cabins, error } = useCabins()
  const [searchParams] = useSearchParams()

  if (isPending) return <Spinner />

  if (!cabins?.length) return <Empty resourceName="cabins" />

  // 1. FILTER CABINS
  const filterValue = searchParams.get("discount") || "all"

  let filteredCabins
  if (filterValue === "no-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount === 0)
  } else if (filterValue === "with-discount") {
    filteredCabins = cabins.filter((cabin) => cabin.discount > 0)
  } else {
    filteredCabins = cabins
  }

  // 2. SORT CABINS
  const sortBy = searchParams.get("sortBy") || "startDate-asc"
  const [field, direction] = sortBy.split("-")
  const modifier = direction === "asc" ? 1 : -1

  const sortedCabins = filteredCabins.sort((a, b) => {
    const aValue = a[field as keyof CabinType] as number
    const bValue = b[field as keyof CabinType] as number
    return (aValue - bValue) * modifier
  })

  return (
    <Menus>
      <Table columns="0.6fr 1.8fr 2.2fr 1fr 1fr 1fr">
        <Table.Header>
          <div />
          <div>Cabin</div>
          <div>Capacity</div>
          <div>Price</div>
          <div>Discount</div>
          <div />
        </Table.Header>
        <Table.Body
          data={sortedCabins}
          render={(cabin: CabinType) => (
            <CabinRow cabin={cabin} key={cabin.id} />
          )}
        />
      </Table>
    </Menus>
  )
}

export default CabinTable
