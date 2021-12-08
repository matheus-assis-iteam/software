import { BiCalendar } from "react-icons/bi";
import AddAppointment from "./components/AddAppointment";
import Search from "./components/Seach";
import AppointmentInfo from "./components/AppointmentInfo";
import { useCallback, useEffect, useState } from "react";

function App() {
  const [appointmentList, setAppointmentList] = useState([]);
  const [query, SetQuery] = useState("")
  const [sortBy, setSortBy] = useState('aptDate')
  const [orderBy, setOrderBy] = useState('desc')

  const filteredAppoimentmentList = appointmentList.filter(
    item => {
      return(
        item.petName.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        item.ownerName.toLocaleLowerCase().includes(query.toLocaleLowerCase()) ||
        item.aptNotes.toLocaleLowerCase().includes(query.toLocaleLowerCase())
      )
    }
  ).sort((a,b) => {
    let order = (orderBy === 'asc') ? 1 : -1
    return(
      a[sortBy].toLocaleLowerCase() < b[sortBy].toLocaleLowerCase()
      ? -1 * order : 1 * order
    )

  })

  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(response => response.json())
      .then(data => {
        setAppointmentList(data)
      });
  }, [])

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl text-center mb-3">
        <BiCalendar className="inline-block text-red-400 aling-top" />
        My Appointments
      </h1>
      <AddAppointment 
        onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
      />
      <Search query={query}
      onQueryChange={myQuery => SetQuery(myQuery)}
      orderBy={orderBy}
      onOrderByChange={myOrder => setOrderBy(myOrder)}
      sortBy={sortBy}
      onSortByChange={mySort => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppoimentmentList.map((appointment) => (
          <AppointmentInfo
            key={appointment.id}
            appointment={appointment}
            onDeleteAppointment={
              appointmentId =>
                setAppointmentList(appointmentList.filter(appointment =>
                  appointment.id !== appointmentId))
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
