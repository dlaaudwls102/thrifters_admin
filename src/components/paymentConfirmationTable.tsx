import React, { useEffect } from 'react';
import clsx from 'clsx';
import {
    createStyles,
    lighten,
    makeStyles,
    Theme,
} from '@material-ui/core/styles';
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
import Tooltip from '@material-ui/core/Tooltip';
import { auth, db } from '../config/firebase';
import { Button, TablePagination } from '@material-ui/core';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

interface Data {
    time: string;
    name: string;
    address: string;
    phone: string;
    date: string;
}

function createData(
    date: string,
    time: string,
    name: string,
    address: string,
    phone: string
): Data {
    return { date, time, name, address, phone };
}

const rows: Data[] = [];

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
    orderBy: Key
): (
    a: { [key in Key]: number | string },
    b: { [key in Key]: number | string }
) => number {
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
    { id: 'date', numeric: false, disablePadding: true, label: '??????' },
    { id: 'time', numeric: false, disablePadding: false, label: '??????' },
    { id: 'name', numeric: false, disablePadding: false, label: '??????' },
    { id: 'address', numeric: false, disablePadding: false, label: '??????' },
    { id: 'phone', numeric: false, disablePadding: false, label: '??????' },
];

interface EnhancedTableProps {
    classes: ReturnType<typeof useStyles>;
    numSelected: number;
    onRequestSort: (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => void;
    onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void;
    order: Order;
    orderBy: string;
    rowCount: number;
}

function EnhancedTableHead(props: EnhancedTableProps) {
    const {
        classes,
        onSelectAllClick,
        order,
        orderBy,
        numSelected,
        rowCount,
        onRequestSort,
    } = props;
    const createSortHandler = (property: keyof Data) => (
        event: React.MouseEvent<unknown>
    ) => {
        onRequestSort(event, property);
    };

    return (
        <TableHead>
            <TableRow>
                <TableCell padding="checkbox">
                    <Checkbox
                        indeterminate={
                            numSelected > 0 && numSelected < rowCount
                        }
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
                        style={{
                            minWidth: '60px',
                            textAlign: 'center',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            fontSize: '18px',
                        }}
                    >
                        <TableSortLabel
                            active={orderBy === headCell.id}
                            direction={orderBy === headCell.id ? order : 'asc'}
                            onClick={createSortHandler(headCell.id)}
                        >
                            {headCell.label}
                            {orderBy === headCell.id ? (
                                <span className={classes.visuallyHidden}>
                                    {order === 'desc'
                                        ? 'sorted descending'
                                        : 'sorted ascending'}
                                </span>
                            ) : null}
                        </TableSortLabel>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

const useToolbarStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(1),
        },
        highlight:
            theme.palette.type === 'light'
                ? {
                      color: 'black',
                      backgroundColor: lighten('#FBAA13', 0.9),
                  }
                : {
                      color: theme.palette.text.primary,
                      backgroundColor: theme.palette.secondary.dark,
                  },
        title: {
            flex: '1 1 100%',
        },
    })
);

interface EnhancedTableToolbarProps {
    numSelected: number;
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
        },
        paper: {
            width: '100%',
            marginBottom: theme.spacing(3),
            boxShadow: 'none',
            border: 'none',
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
            fontFamily: 'TmoneyRoundWindExtraBold',
        },
    })
);

export default function PaymentConfirmationTable() {
    const classes = useStyles();
    const [order, setOrder] = React.useState<Order>('asc');
    const [orderBy, setOrderBy] = React.useState<keyof Data>('date');
    const [selected, setSelected] = React.useState<string[]>([]);
    const [page, setPage] = React.useState(0);
    const [dense, setDense] = React.useState(false);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);
    const [totalHistory, setTotalHistory] = React.useState<Data[]>();

    //newData
    const [orderHistory, setOrderHistory] = React.useState<Data[]>([]);
    const [orderHisortNon, setOrderHistoryNon] = React.useState<Data[]>([]);
    const [orderUser, setOrderUser] = React.useState<any>();
    const [selectedOrder, setSelectedOrder] = React.useState<any>();
    const [cound, setCound] = React.useState<any>();
    const [userSelected, setUserSelected] = React.useState<any>();
    const [userOrderSelected, setUserOrderSelected] = React.useState<any>();
    const [change, setChange] = React.useState<any>(false);

    //newInput data
    const [weight, setWeight] = React.useState<number>();
    const [additional, setAdditional] = React.useState<any>();
    const [rating, setRating] = React.useState<number>();
    // history
    const history = useHistory();
    //show Modal
    const [onOff, setOnOff] = React.useState(false);

    const handleRequestSort = (
        event: React.MouseEvent<unknown>,
        property: keyof Data
    ) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleSelectAllClick = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        if (event.target.checked) {
            const newSelecteds = rows.map((n) => n.name);
            setSelected(newSelecteds);
            return;
        }
        setSelected([]);
    };

    const EnhancedTableToolbar = (props: EnhancedTableToolbarProps) => {
        const classes = useToolbarStyles();
        const { numSelected } = props;

        return (
            <Toolbar
                className={clsx(classes.root, {
                    [classes.highlight]: numSelected > 0,
                })}
                style={{ padding: '10px 0' }}
            >
                {numSelected > 0 ? (
                    <Typography
                        style={{ fontFamily: 'TmoneyRoundWindExtraBold' }}
                        className={classes.title}
                        color="inherit"
                        variant="subtitle1"
                        component="div"
                    >
                        {numSelected} ??? ??????
                    </Typography>
                ) : (
                    <Typography
                        style={{ fontFamily: 'TmoneyRoundWindExtraBold' }}
                        className={classes.title}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        <img
                            id="pot"
                            className="img-announce"
                            src="../003.png"
                        ></img>
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <>
                        <Tooltip title="????????????">
                            <div
                                style={{
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                    fontSize: '15px',
                                    width: '25%',
                                    border: 'solid 3px',
                                    borderRadius: '1rem',
                                    margin: '10px',
                                    padding: '4px',
                                }}
                                onClick={() => {
                                    showModal();
                                }}
                            >
                                ????????????
                            </div>
                        </Tooltip>
                    </>
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

    const handleClick = (event: React.MouseEvent<unknown>, name: string) => {
        const selectedIndex = selected.indexOf(name);
        let newSelected: string[] = [];

        if (selectedIndex === -1) {
            newSelected = newSelected.concat(selected.slice(1), name);
        } else if (selectedIndex === 0) {
            newSelected = newSelected.concat(selected.slice(1));
        }

        const filtered = orderUser.filter(
            (order: any) =>
                order.date + ', ' + order.time + ', ' + order.name ==
                newSelected[0]
        );

        if (selected.length === 0) {
            db.collection('user')
                .doc(filtered[0].uid)
                .get()
                .then((doc) => {
                    setUserSelected(doc.data()!);
                    setUserOrderSelected(doc.data()!.orders);
                    setSelected(newSelected);
                });
        }
        if (selected.length >= 1) {
            setSelected(newSelected);
        }
    };

    const handleChangePage = (event: unknown, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const isSelected = (name: string) => selected.indexOf(name) !== -1;

    // const emptyRows = rowsPerPage - Math.min(rowsPerPage, orderHistory.length - page * rowsPerPage);

    // MADE FUNCTIONS

    const showModal = () => {
        const filtered = orderHistory!.filter(
            (order) =>
                order.date + ', ' + order.time + ', ' + order.name ==
                selected[0]
        );
        setSelectedOrder(filtered[0]);
    

        if (orderUser) {
            const filtered = orderUser.filter(
                (order: any) =>
                    order.date + ', ' + order.time + ', ' + order.name ==
                    selected[0]
            );


            if (filtered[0].userId === 'non_user') {
                db.collection('user')
                    .doc('non_user')
                    .get()
                    .then((doc) => {
                        doc.data()!.orders.forEach((showing: any) => {
                            if (filtered[0].phone === showing.phone) {
                                setUserSelected(showing);

                                setUserOrderSelected(doc.data()!.orders);
                            }
                        });
                    });
            } else {
                db.collection('user')
                    .doc(filtered[0].uid)
                    .get()
                    .then((doc) => {
                        setUserSelected(doc.data()!);
                        setUserOrderSelected(doc.data()!.orders);
                    });
            }
        }

        setCound(filtered[0]);
        setOnOff(true);
    };
    const handleChange = (prop: string) => (event: any) => {
        if (prop === 'weight_') {
            setWeight(event.target.value);
        } else if (prop === 'additional_') {
            setAdditional(event.target.value);
        } else if (prop === 'rating_') {
            setRating(event.target.value);
        }
    };
    const delay = (ms: any) => new Promise((res: any) => setTimeout(res, ms));
    const turnDown = async () => {
        setOnOff(false);
        var reason = prompt('????????? ???????????????');
        if (reason != undefined) {
            var confirmDelete = window.confirm('?????? ???????????????????');
            if (confirmDelete) {
                const filtered: any = orderHistory!.filter(
                    (order) =>
                        order.date + ', ' + order.time + ', ' + order.name ==
                        selected[0]
                );
                filtered[0].weight = '??????';
                filtered[0].additional = '??????';
                filtered[0].confirmed = '??????';
                filtered[0]['turndown_reason'] = reason;
                filtered[0]['confirmed_By'] = auth.currentUser?.displayName!;
                filtered[0]['rating'] = 0;
                const timestamp = Date.now(); // This would be the timestamp you want to format
                filtered[0]['confirmed_Time'] = new Intl.DateTimeFormat(
                    'en-US',
                    {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }
                ).format(timestamp);

                //sent to confirmed orders

                db.collection('orders')
                    .doc('confirmed')
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            filtered[0]
                        ),
                    });
                console.log(
                    '[' + Date.now() + ']' + 'DONE Sending Data to Confirmed'
                );

                db.collection('orders')
                    .doc('user')
                    .update({
                        orders: totalHistory!.filter(
                            (order) =>
                                order.date +
                                    ', ' +
                                    order.time +
                                    ', ' +
                                    order.name !==
                                selected[0]
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE deleting Data from admin user orders (??????)'
                );

                const filtered2: any = totalHistory!.filter(
                    (order) =>
                        order.date + ', ' + order.time + ', ' + order.name ==
                        selected[0]
                );
                var found_date = userOrderSelected.filter(
                    (order: any) => order.date == filtered2[0].date
                );
                var found_time = found_date.filter(
                    (order: any) => order.time == filtered2[0].time
                );
                found_time[0].confirmed = '??????';
                found_time[0].weight = reason;
                found_time[0].additional = reason;
                var today = new Date(),
                    date =
                        today.getFullYear() +
                        '/' +
                        (today.getMonth() + 1) +
                        '/' +
                        today.getDate();
                const messages = {
                    date: date,
                    time: new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }).format(timestamp),
                    read: false,
                    title: '????????????',
                    info: '????????????',
                    reason: reason,
                    order: found_time[0],
                };
                db.collection('user')
                    .doc(filtered2[0].uid!)
                    .update({
                        orders: userOrderSelected!.filter(
                            (post: any) => post.date !== filtered2[0].date
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE deleting current User order (??????)'
                );

                db.collection('user')
                    .doc(filtered2[0].uid!)
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            found_time[0]
                        ),
                        message: firebase.firestore.FieldValue.arrayUnion(
                            messages
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE pushing updated data to user orders (??????)'
                );
                setSelected([]);
                await delay(500);
                history.push('/confirmed');
            } else {
                setSelected([]);
            }
        }
    };

    const finished = async (user: string) => {
        var confirmPayment = window.confirm('???????????? ????????????????');
        if (confirmPayment) {
            selectedOrder.confirmed = '??????';
            selectedOrder['payed_By'] = user;
            const timestamp = Date.now(); // This would be the timestamp you want to format
            selectedOrder['payConfirmed_Time'] = new Intl.DateTimeFormat(
                'en-US',
                {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                }
            ).format(timestamp);

            //sent to confirmed orders
            db.collection('orders')
                .doc('confirmed')
                .update({
                    orders: firebase.firestore.FieldValue.arrayUnion(
                        selectedOrder
                    ),
                });
            console.log(
                '[' + Date.now() + ']' + 'DONE Sending Data to Confirmed'
            );

            //finding user's info's order and deleting, and updating it with confirmed order

            if (userSelected.userId !== 'non_user') {
                var totalWeight =
                    Number(userSelected.totalWeight) + Number(weight);
                var totalAdditional =
                    Number(userSelected.totalAdditional) + Number(additional);
                var numberOrd = userSelected.numberOfOrders;
                var found_date = userOrderSelected.filter(
                    (order: any) => order.date == selectedOrder.date
                );
                var found_time = found_date.filter(
                    (order: any) => order.time == selectedOrder.time
                );
                found_time[0].confirmed = '??????';

                db.collection('user')
                    .doc(selectedOrder.uid)
                    .update({
                        orders: userOrderSelected!.filter(
                            (post: any) => post.date !== selectedOrder.date
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE deleting current User order (??????)'
                );

                var today = new Date(),
                    date =
                        today.getFullYear() +
                        '/' +
                        (today.getMonth() + 1) +
                        '/' +
                        today.getDate();
                const messages = {
                    date: date,
                    time: new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                    }).format(timestamp),
                    read: false,
                    title: '????????????',
                    info: '????????????',
                    order: found_time[0],
                };
                db.collection('user')
                    .doc(selectedOrder.uid)
                    .update({
                        orders: firebase.firestore.FieldValue.arrayUnion(
                            found_time[0]
                        ),
                        message: firebase.firestore.FieldValue.arrayUnion(
                            messages
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE pushing updated data to user orders (??????)'
                );

                //delete from admin user order
                db.collection('orders')
                    .doc('user')
                    .update({
                        orders: totalHistory!.filter(
                            (order) =>
                                order.date +
                                    ', ' +
                                    order.time +
                                    ', ' +
                                    order.name !==
                                selected[0]
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE deleting Data from admin user orders (??????)'
                );
                alert('???????????? ?????????????????????.');
                setSelected([]);
                await delay(500);
                history.push('/confirmed');
            }
        }
        // else{

        //     var found_date = userOrderSelected.filter((order:any) => (order.date) == selectedOrder.date);
        //     var found_time = found_date.filter((order:any) => (order.time) == selectedOrder.time);
        //         found_time[0].confirmed = "??????"
        //         found_time[0].weight = weight;
        //         found_time[0].additional = additional;

        //     db.collection('user').doc('non_user').update({
        //       orders : userOrderSelected!.filter((post:any) => post.name !== selectedOrder.name)
        //     })
        //     console.log("[" + Date.now() + "]" + "DONE deleting current User order")

        //     db.collection('user').doc("non_user").update({
        //       count: firebase.firestore.FieldValue.increment(-1),
        //       orders : firebase.firestore.FieldValue.arrayUnion(found_time[0]),
        //     })
        //     console.log("[" + Date.now() + "]" + "DONE pushing updated data to user orders")

        //     //delete from admin user order
        //   db.collection("orders").doc("non_user").update({
        //     orders: orderHistory!.filter(order => (order.date + ", " + order.time + ", " + order.name) !== selected[0])
        //   })
        //     console.log("[" + Date.now() + "]" + "DONE deleting Data from admin user orders")
        //     alert("???????????? ?????????????????????.")
        //     setSelected([]);
        //     await delay(500);
        //     history.push("/confirmed");
        // }
    };

    // Gathering data
    // useEffect(()=>{
    //   console.log(selected, orderUser,"before")
    //     if(orderUser && selected){
    //       console.log(selected, orderUser,"after")
    //       const filtered = orderUser.filter((order:any) => (order.date + ", " + order.time + ", " + order.name) == selected[0])
    //       console.log(filtered[0],"filtered");
    //       if (filtered[0].userId == "non_user"){
    //             db.collection('user').doc("non_user").get().then((doc)=>{
    //               doc.data()!.orders.forEach((showing:any) =>{
    //                 if(filtered[0].phone === showing.phone){
    //                   console.log(showing, "setUserSleceted");
    //                   setUserSelected(showing);
    //                   console.log(doc.data()!.orders, "setUseOrderSleceted");
    //                   setUserOrderSelected(doc.data()!.orders);
    //                 }
    //               })
    //             })
    //           }
    //           else{
    //         db.collection('user').doc(filtered[0].userId).get().then((doc)=>{
    //             setUserSelected(doc.data()!)
    //             setUserOrderSelected(doc.data()!.orders)
    //             console.log(doc.data()!, doc.data()!.orders, "hasdasd")
    //         })
    //       }
    //     }
    // },[selected])
    useEffect(() => {
        //?????? ????????? ?????? ?????? ?????? ??? ?????? document ??? OrderHistory ??? USER ??? PUSH
        db.collection('orders')
            .doc('user')
            .get()
            .then((doc) => {
                setOrderHistory([
                    ...doc
                        .data()!
                        .orders.filter(
                            (unconfirmed: any) =>
                                unconfirmed.confirmed === '??????'
                        ),
                ]);
                setOrderUser([
                    ...doc
                        .data()!
                        .orders.filter(
                            (unconfirmed: any) =>
                                unconfirmed.confirmed === '??????'
                        ),
                ]);
                setTotalHistory([...doc.data()!.orders]);
            });
        // setChange(true);
    }, [...selected]);
    useEffect(() => {
        //?????? ????????? ?????? ?????? ?????? ??? ?????? ????????? document ??? OrderHistory ??? USER ??? PUSH
        // if(!change){
        //  if(orderHistory!=[]){
        //   db.collection('orders').doc("non_user").get().then((doc)=>{
        //     setOrderHistory([...doc.data()!.orders]);
        //     setOrderUser([...doc.data()!.orders]);
        //   })
        // }
        //   console.log("hi")
        // }
    }, [change]);
    return (
        <div className={classes.root}>
            <img className="img-logo-small" src="./thrifter_logo.png"></img>
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
                            rowCount={orderHistory!.length}
                        />
                        <TableBody>
                            {stableSort(
                                orderHistory!,
                                getComparator(order, orderBy)
                            )
                                .slice(
                                    page * rowsPerPage,
                                    page * rowsPerPage + rowsPerPage
                                )
                                .map((row, index) => {
                                    const isItemSelected = isSelected(
                                        row.date +
                                            ', ' +
                                            row.time +
                                            ', ' +
                                            row.name
                                    );
                                    const labelId = `enhanced-table-checkbox-${index}`;

                                    return (
                                        <TableRow
                                            hover
                                            onClick={(event) =>
                                                handleClick(
                                                    event,
                                                    row.date +
                                                        ', ' +
                                                        row.time +
                                                        ', ' +
                                                        row.name
                                                )
                                            }
                                            role="checkbox"
                                            aria-checked={isItemSelected}
                                            tabIndex={-1}
                                            key={
                                                row.date +
                                                ', ' +
                                                row.time +
                                                ', ' +
                                                row.name
                                            }
                                            selected={isItemSelected}
                                            style={{
                                                minWidth: '60px',
                                                textAlign: 'center',
                                                fontFamily:
                                                    'TmoneyRoundWindExtraBold',
                                            }}
                                        >
                                            <TableCell padding="checkbox">
                                                <Checkbox
                                                    checked={isItemSelected}
                                                    inputProps={{
                                                        'aria-labelledby': labelId,
                                                    }}
                                                />
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    minWidth: '70px',
                                                    textAlign: 'center',
                                                    fontFamily:
                                                        'TmoneyRoundWindExtraBold',
                                                }}
                                                component="th"
                                                id={labelId}
                                                scope="row"
                                                padding="none"
                                            >
                                                {row.date.slice(-5)}
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    minWidth: '70px',
                                                    textAlign: 'center',
                                                    fontFamily:
                                                        'TmoneyRoundWindExtraBold',
                                                }}
                                                align="right"
                                            >
                                                {row.time}
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    minWidth: '70px',
                                                    textAlign: 'center',
                                                    fontFamily:
                                                        'TmoneyRoundWindExtraBold',
                                                }}
                                                align="right"
                                            >
                                                {row.name}
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    fontSize: '15px',
                                                    minWidth: '200px',
                                                    textAlign: 'center',
                                                    fontFamily:
                                                        'TmoneyRoundWindExtraBold',
                                                }}
                                                align="right"
                                            >
                                                {row.address}
                                            </TableCell>
                                            <TableCell
                                                style={{
                                                    minWidth: '200px',
                                                    textAlign: 'center',
                                                    fontFamily:
                                                        'TmoneyRoundWindExtraBold',
                                                }}
                                                align="right"
                                            >
                                                {row.phone}
                                            </TableCell>
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
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
            {onOff ? (
                <div>
                    <div style={{ fontWeight: 600, color: 'black' }}>
                        <div style={{ padding: '10px' }}>
                            ??????: { <>{userSelected.bank_type}</>}
                        </div>
                        <div style={{ padding: '10px' }}>
                            ????????????:{' '}
                            { <>{userSelected.accountNumber}</>}
                        </div>
                        <div style={{ padding: '10px' }}>
                            ?????????: { <>{userSelected.name}</>}
                        </div>
                    </div>
                    <div style={{paddingBottom:"20px"}}>
                    <Button
                        onClick={() => {
                            finished(auth.currentUser?.displayName!);
                        }}
                        style={{
                            width: '65%',
                            padding: '10px',
                            margin: 'auto',
                            border: 'solid 2px',
                            borderRadius: '10rem',
                            color: 'black',
                            fontFamily: 'TmoneyRoundWindExtraBold',
                        }}
                    >
                        ????????????
                    </Button>
                    </div>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
