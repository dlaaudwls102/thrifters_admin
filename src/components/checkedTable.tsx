import React, { useEffect } from 'react';
import clsx from 'clsx';
import { createStyles, lighten, makeStyles, Theme } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Checkbox from '@material-ui/core/Checkbox';
import IconButton from '@material-ui/core/IconButton';
import Tooltip from '@material-ui/core/Tooltip';
import Switch from '@material-ui/core/Switch';
import DeleteIcon from '@material-ui/icons/Delete';
import FilterListIcon from '@material-ui/icons/FilterList';
import { auth, db } from '../config/firebase';
import { Button, FormControl, FormControlLabel, InputAdornment, TextField, withStyles, TablePagination } from '@material-ui/core';
import firebase from "firebase/app";

interface Data {
  payConfirmed_Time: string;
  payed_By: string;
  name: string;
  additional: number;
  weight: number;
}


function createData(
  payConfirmed_Time: string,
  payed_By: string,
  name: string,
  weight: number,
  additional: number,

): Data {
  return { payConfirmed_Time, payed_By, name, weight, additional};
}

const rows = [
  createData('2021-08-25', "03:20", "신영관" , 300, 4000),
];

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (a: { [key in Key]: number | string }, b: { [key in Key]: number | string }) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort<T>(array: T[], comparator: (a: T, b: T) => number) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

interface HeadCell {
  disablePadding: boolean;
  id: keyof Data;
  label: string;
  numeric: boolean;
}

const headCells: HeadCell[] = [
  { id: 'payConfirmed_Time', numeric: false, disablePadding: true, label: '시간' },
  { id: 'payed_By', numeric: false, disablePadding: false, label: '담당' },
  { id: 'name', numeric: false, disablePadding: false, label: '고객' },
  { id: 'weight', numeric: true, disablePadding: false, label: '무게' },
  { id: 'additional', numeric: true, disablePadding: false, label: '추가' },
];

interface EnhancedTableProps {
  classes: ReturnType<typeof useStyles>;
  numSelected: number;
  onRequestSort: (event: React.MouseEvent<unknown>, property: keyof Data) => void;
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
  order: Order;
  orderBy: string;
  rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { classes, onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } = props;
  const createSortHandler = (property: keyof Data) => (event: React.MouseEvent<unknown>) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ 'aria-label': 'select all desserts' }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'}
            sortDirection={orderBy === headCell.id ? order : false}
            style ={{minWidth:"60px",textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold', fontSize:"18px"}}
          >
            <TableSortLabel
              active={orderBy === headCell.id}
              direction={orderBy === headCell.id ? order : 'asc'}
              onClick={createSortHandler(headCell.id)}
            >
              {headCell.label}
              {orderBy === headCell.id ? (
                <span className={classes.visuallyHidden}>
                  {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                </span>
              ) : null}
            </TableSortLabel>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
const formatNumber = (inputNumber: number) => {
  let formatedNumber = Number(inputNumber)
      .toFixed(2)
      .replace(/\d(?=(\d{3})+\.)/g, '$&,');
  let splitArray = formatedNumber.split('.');
  if (splitArray.length > 1) {
      formatedNumber = splitArray[0];
  }
  return formatedNumber;
};
const useToolbarStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      paddingLeft: theme.spacing(2),
      paddingRight: theme.spacing(1),
    },
    highlight:
      theme.palette.type === 'light'
        ? {
            color: "black",
            backgroundColor: lighten("#FBAA13", 0.9),
          }
        : {
            color: theme.palette.text.primary,
            backgroundColor: theme.palette.secondary.dark,
          },
    title: {
      flex: '1 1 100%',
    },
  }),
);

interface EnhancedTableToolbarProps {
  numSelected: number;
}

const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
      style={{padding:"10px 0"}}
    >
      {numSelected > 0 ? (
        <Typography style={{ fontFamily: 'TmoneyRoundWindExtraBold'}} className={classes.title} color="inherit" variant="subtitle1" component="div">
          {numSelected} 개 선택
        </Typography>
      ) : (
        <Typography style={{ fontFamily: 'TmoneyRoundWindExtraBold'}} className={classes.title} variant="h6" id="tableTitle" component="div">
         <img
                    id="pot"
                    className="img-announce"
                    src="../004.png"
                ></img>
        </Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton aria-label="delete">
            <DeleteIcon />
          </IconButton>
        </Tooltip>
      ) : (
        // <Tooltip title="Filter list">
        //   <IconButton aria-label="filter list">
        //     <FilterListIcon />
        //   </IconButton>
        // </Tooltip>
        <></>
      )}
    </Toolbar>
  );
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    paper: {
      width: '100%',
      marginBottom: theme.spacing(3),
      boxShadow:"none",
      border:"none"
    },
    table: {
      minWidth: 300,
    },
    visuallyHidden: {
      border: 0,
      clip: 'rect(0 0 0 0)',
      height: 1,
      margin: -1,
      overflow: 'hidden',
      padding: 0,
      position: 'absolute',
      top: 10,
      width: 1,
      fontFamily: 'TmoneyRoundWindExtraBold'
    },
  }),
);

export default function CheckedTable() {
  const classes = useStyles();
  const [order, setOrder] = React.useState<Order>('asc');
  const [orderBy, setOrderBy] = React.useState<keyof Data>('payConfirmed_Time');
  const [selected, setSelected] = React.useState<string[]>([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  //newData
  const [orderHistory,setOrderHistory] = React.useState([createData('2021-08-25', "03:20", "신영관" , 300, 3000)]);
  const [orderUser,setOrderUser] = React.useState<any>();
  const [selectedOrder,setSelectedOrder] = React.useState<any>();
  const [cound,setCound] = React.useState<any>();
  const [userSelected, setUserSelected] = React.useState<any>();
  const [userOrderSelected, setUserOrderSelected] = React.useState<any>();

  //newInput data
  const [weight, setWeight] = React.useState<number>();
  const [additional, setAdditional] = React.useState<any>();
  const [rating, setRating] = React.useState<number>();
 
  //show Modal
  const [onOff,setOnOff] = React.useState(false);

  const handleRequestSort = (event: React.MouseEvent<unknown>, property: keyof Data) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.payConfirmed_Time);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected: string[] = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked);
  };

  const isSelected = (name: string) => selected.indexOf(name) !== -1;

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, orderHistory.length - page * rowsPerPage);

  // MADE FUNCTIONS

  const showModal = () =>{
    const filtered = orderHistory.filter(order => (order.payConfirmed_Time) == selected[0]);
    setSelectedOrder(filtered[0]);
    setCound(filtered[0]);
    setOnOff(true);

  }
  const handleChange = (prop : string) => (event: any) => {
      
    if (prop === "weight_"){
      setWeight(event.target.value)
    }
    else if (prop === "additional_"){
      setAdditional(event.target.value)
    }
    else if (prop === "rating_"){
      setRating(event.target.value)
    }

  }
  
  const finished = (user:string) =>{

    selectedOrder.weight = weight;
    selectedOrder.additional = additional;
    selectedOrder.confirmed = "확인";
    selectedOrder["payed_By"] = user;
    selectedOrder["rating"] = rating;
    const timestamp = Date.now(); // This would be the timestamp you want to format
    selectedOrder['payConfirmed_Time'] = new Intl.DateTimeFormat('en-US', {year: 'numeric', month: '2-digit',day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit'}).format(timestamp);

    //sent to confirmed orders
    db.collection("orders").doc("confirmed").update({
      orders: firebase.firestore.FieldValue.arrayUnion(selectedOrder)
    })
    console.log("[" + Date.now() + "]" + "DONE Sending Data to Confirmed")
    
    //finding user's info's order and deleting, and updating it with confirmed order


    var totalWeight = Number(userSelected.totalWeight) + Number(weight);
    var totalAdditional = Number(userSelected.totalAdditional) + Number(additional);
    var numberOrd = userSelected.numberOfOrders;
    var found_date = userOrderSelected.filter((order:any) => (order.date) == selectedOrder.date);
    var found_time = found_date.filter((order:any) => (order.time) == selectedOrder.time);
        found_time[0].confirmed = "확인"
        found_time[0].weight = weight;
        found_time[0].additional = additional;
    
    db.collection('user').doc(selectedOrder.uid).update({
      orders : userOrderSelected!.filter((post:any) => post.date !== selectedOrder.date)
    })
    console.log("[" + Date.now() + "]" + "DONE deleting current User order")

    db.collection('user').doc(selectedOrder.uid).update({
      orders: firebase.firestore.FieldValue.arrayUnion(found_time[0]),
      averageWeights : (totalWeight/numberOrd).toFixed(2),
      totalWeight: Number(totalWeight),
      totalAdditional: Number(totalAdditional)
    })
    console.log("[" + Date.now() + "]" + "DONE pushing updated data to user orders")
  
    //delete from admin user order
  db.collection("orders").doc("user").update({
    orders: orderHistory.filter(order => (order.payConfirmed_Time) !== selected[0])
  })
    console.log("[" + Date.now() + "]" + "DONE deleting Data from admin user orders")
    
  }

  // Gaterhing data
  useEffect(()=>{
        
    db.collection('orders').doc("confirmed").get().then((doc)=>{
            setOrderHistory(doc.data()!.orders);
            setOrderUser(doc.data()!.orders);
        })
},[])
//   useEffect(()=>{
//       if(selected && orderUser ){
//         const filtered = orderUser.filter((order:any) => (order.date + ", " + order.time + ", " + order.name) == selected[0])

//             db.collection('user').doc(filtered[0].uid).get().then((doc)=>{
    
//               setUserSelected(doc.data()!)
//               setUserOrderSelected(doc.data()!.orders)
//           })
//       }
//   },[selected])
  return (
    <div className={classes.root}>
           <img
                    id="pot"
                    className="img-logo-small"
                    src="../thrifter_logo.png"
                ></img>
      <Paper className={classes.paper}>
        <EnhancedTableToolbar numSelected={selected.length} />
        <TableContainer>
          <Table
            className={classes.table}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
            aria-label="enhanced table"
          >
            <EnhancedTableHead
              classes={classes}
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={orderHistory.length}
            />
            <TableBody>
              {stableSort(orderHistory, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
                  const isItemSelected = isSelected(row.payConfirmed_Time);
                  const labelId = `enhanced-table-checkbox-${index}`;

                  return (
                    <TableRow
                      hover
                      onClick={(event) => handleClick(event, row.payConfirmed_Time)}
                      role="checkbox"
                      aria-checked={isItemSelected}
                      tabIndex={-1}
                      key={row.payConfirmed_Time}
                      selected={isItemSelected}
                      style={{minWidth:"60px",textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold'}}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isItemSelected}
                          inputProps={{ 'aria-labelledby': labelId }}
                        />
                      </TableCell>
                      <TableCell style={{minWidth:"70px", textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold'}} component="th" id={labelId} scope="row" padding="none">
                        {(row.payConfirmed_Time)?row.payConfirmed_Time:"취소"}
                      </TableCell>
                      <TableCell style={{minWidth:"70px", textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold'}} align="right">{row.payed_By}</TableCell>
                      <TableCell style={{minWidth:"70px", textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold'}} align="right">{row.name}</TableCell>
                      <TableCell style={{fontSize:"15px", minWidth:"70px", textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold'}} align="right">{(row.weight.toString() === "취소")?row.weight:formatNumber(row.weight) + " 원"}</TableCell>
                      <TableCell style={{minWidth:"100px", textAlign:"center", fontFamily: 'TmoneyRoundWindExtraBold'}} align="right">{(row.additional.toString() === "취소")?row.additional:formatNumber(row.additional) + " 원"}</TableCell>
                    </TableRow>
                  );
                })}
              {/* {emptyRows > 0 && (
                <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                  <TableCell colSpan={5} />
                </TableRow>
              )} */}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={orderHistory.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={
              handleChangeRowsPerPage
          }
      />
      </Paper>
      {/* <Button className="buttons" style={{fontFamily: 'TmoneyRoundWindExtraBold', padding:"4px"}} variant="outlined" onClick={()=>{showModal()}} >선택</Button> */}
     {(onOff)?
      <div className="modal" style={{margin:"auto", padding:"30px 0 ", width:"90%"}}>
        <div>
          <div className="total"> 
            <div  className="totalCate" >
                <div style={{ borderBottom:"solid black 5px", 
                  margin: "auto",
                  backgroundColor:"#07381B",
                  color:"white",
                  padding: "10px 0px",fontSize:"20px"}} >
                  무게입력 (KG)
                </div>
                <div className="totalCate_price" style={{    margin:"auto",
                  padding: "20px 0",}}>
                  <FormControl style={{width:"50%"}} >
                    <TextField
                        style = {{top:"2px", marginBottom:"25px"}}
                            id="input-with-icon-textfield"
                            type="input"
                            onChange={handleChange("weight_")}
                            placeholder="무게를 입력해주세요"
                            inputProps={{ style: { textAlign: 'center',fontSize:"19px", fontFamily: 'Cafe24Oneprettynight' },
                            'aria-label': 'naked',
                            startAdornment: (
                              <InputAdornment position="start">
                              </InputAdornment>
                          ),}}
                            InputLabelProps={{ 
                              style:{fontSize:"25px", fontFamily: 'TmoneyRoundWindExtraBold'}
                              }}
                    />
                  </FormControl>
              </div>
            </div>
            <div  className="totalCate" >
                <div style={{ borderBottom:"solid black 5px", 
                  margin: "auto",
                  backgroundColor:"#07381B",
                  color:"white",
                  padding: "10px 0px",fontSize:"20px"}} >
                  추가금액 입력 (원)
                </div>
                <div className="totalCate_price" style={{    margin:"auto",
                  padding: "20px 0",}}>
                  <FormControl style={{width:"50%"}} >
                    <TextField
                        style = {{top:"2px", marginBottom:"25px"}}
                            id="input-with-icon-textfield"
                            type="input"
                            onChange={handleChange("additional_")}
                            placeholder="추가금액을 입력해주세요"
                            inputProps={{ style: { textAlign: 'center',fontSize:"19px", fontFamily: 'Cafe24Oneprettynight' },
                            'aria-label': 'naked',
                            startAdornment: (
                              <InputAdornment position="start">
                              </InputAdornment>
                          ),}}
                            InputLabelProps={{ 
                              style:{fontSize:"25px", fontFamily: 'TmoneyRoundWindExtraBold'}
                              }}
                    />
                  </FormControl>
              </div>
            </div>
            <div  className="totalCate" >
                <div style={{ borderBottom:"solid black 5px", 
                  margin: "auto",
                  backgroundColor:"#07381B",
                  color:"white",
                  padding: "10px 0px",fontSize:"20px"}} >
                  별점 입력( 1 ~ 5)
                </div>
                <div className="totalCate_price" style={{    margin:"auto",
                  padding: "20px 0",}}>
                  <FormControl style={{width:"50%"}} >
                    <TextField
                        style = {{top:"2px", marginBottom:"25px"}}
                            id="input-with-icon-textfield"
                            type="input"
                            onChange={handleChange("rating_")}
                            placeholder="평가를 입력해주세요"
                            inputProps={{ style: { textAlign: 'center',fontSize:"19px", fontFamily: 'Cafe24Oneprettynight' },
                            'aria-label': 'naked',
                            startAdornment: (
                              <InputAdornment position="start">
                              </InputAdornment>
                          ),}}
                            InputLabelProps={{ 
                              style:{fontSize:"25px", fontFamily: 'TmoneyRoundWindExtraBold'}
                              }}
                    />
                  </FormControl>
              </div>
            </div>
          </div>
        </div>
        <Button className="buttons" style={{fontFamily: 'TmoneyRoundWindExtraBold', padding:"4px", width:"50%"}} variant="outlined" onClick={()=>{finished(auth.currentUser?.displayName!)}} >매입 완료</Button>
      </div>
     :<></>

     
    }
    </div>
  );
}