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
import {
    Button,
    FormControl,
    InputAdornment,
    TextField,
    TablePagination,
} from '@material-ui/core';
import firebase from 'firebase/app';
import { useHistory } from 'react-router-dom';

interface Data {
    name: string;
    price_range: string;
    phone: string;
    date: string;
    product: string;
}

function createData(
    date: string,
    name: string,
    price_range: string,
    phone: string,
    product: string
): Data {
    return { date, name, product, price_range, phone };
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
    { id: 'date', numeric: false, disablePadding: true, label: '날짜' },
    { id: 'name', numeric: false, disablePadding: false, label: '성함' },
    { id: 'product', numeric: false, disablePadding: false, label: '품목' },
    {
        id: 'price_range',
        numeric: false,
        disablePadding: false,
        label: '가격대',
    },
    { id: 'phone', numeric: false, disablePadding: false, label: '전화' },
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

export default function NeedsTable() {
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
    const [additional, setAdditional] = React.useState<any>(0);
    const [rating, setRating] = React.useState<number>(0);
    // history
    const history = useHistory();
    //show Modal
    const [onOff, setOnOff] = React.useState(false);

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
                        {numSelected} 개 선택
                    </Typography>
                ) : (
                    <Typography
                        style={{ fontFamily: 'TmoneyRoundWindExtraBold' }}
                        className={classes.title}
                        variant="h6"
                        id="tableTitle"
                        component="div"
                    >
                        필요해요 신청
                    </Typography>
                )}
                {numSelected > 0 ? (
                    <>
                        <Tooltip title="매입하기">
                            <div
                                style={{
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                    fontSize: '15px',
                                    width: '25%',
                                    border: 'solid 3px',
                                    borderRadius: '1rem',
                                    margin: '10px',
                                }}
                                onClick={() => {
                                    showModal();
                                }}
                            >
                                해결
                            </div>
                        </Tooltip>
                        <Tooltip title="취소하기">
                            <div
                                style={{
                                    fontFamily: 'TmoneyRoundWindExtraBold',
                                    fontSize: '15px',
                                    width: '25%',
                                    border: 'solid 3px',
                                    borderRadius: '1rem',
                                    margin: '10px',
                                }}
                                onClick={() => {
                                    turnDown();
                                }}
                            >
                                없음
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
                order.date + ', ' + order.product + ', ' + order.name ==
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
                order.date + ', ' + order.product + ', ' + order.name ==
                selected[0]
        );
        setSelectedOrder(filtered[0]);

        if (orderUser) {
            const filtered = orderUser.filter(
                (order: any) =>
                    order.date + ', ' + order.product + ', ' + order.name ==
                    selected[0]
            );

            if (filtered[0].userId == 'non_user') {
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
        var reason = prompt('이유를 적어주세요');
        if (reason != undefined) {
            const timeStamp = Date.now();
            var date = new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: undefined,
                minute: undefined,
                second: undefined,
            }).format(timeStamp);
            date = date.slice(-4) + '/' + date.slice(0, 5);
            const hour = new Intl.DateTimeFormat('en-US', {
                year: undefined,
                month: undefined,
                day: undefined,
                hour: '2-digit',
                minute: '2-digit',
                second: undefined,
            }).format(timeStamp);
            var confirmDelete = window.confirm('찾기를 실패 하시겠습니까?');
            if (confirmDelete) {
                const filtered: any = orderHistory!.filter(
                    (order) =>
                        order.date + ', ' + order.product + ', ' + order.name ==
                        selected[0]
                );
                filtered[0].confirmed = '찾기실패';
                filtered[0]['turndown_reason'] = reason;
                filtered[0]['failed_By'] = auth.currentUser?.displayName!;
                const timestamp = Date.now(); // This would be the timestamp you want to format
                filtered[0]['failedConfirmed_Time'] = new Intl.DateTimeFormat(
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

                const messages = {
                    date: date,
                    time: hour.slice(0, 5),
                    read: false,
                    title: filtered[0]['product'],
                    info: '찾기실패',
                    reason: reason,
                };
                //sent to confirmed orders

                db.collection('needs')
                    .doc('user')
                    .update({
                        needs: totalHistory!.filter(
                            (order) =>
                                order.date +
                                    ', ' +
                                    order.product +
                                    ', ' +
                                    order.name !==
                                selected[0]
                        ),
                    });
                db.collection('user')
                    .doc(filtered[0]['uid'])
                    .update({
                        message: firebase.firestore.FieldValue.arrayUnion(
                            messages
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE deleting Data from admin user orders (회원)'
                );
                db.collection('needs')
                    .doc('user')
                    .update({
                        needs: firebase.firestore.FieldValue.arrayUnion(
                            filtered[0]
                        ),
                    });

                setSelected([]);
                await delay(500);
                history.push('/');
            } else {
                setSelected([]);
            }
        }
    };

    const finished = async (user: string) => {
        var confirmDelete = window.confirm(
            '고객님이 필요하신것을 해결 하셨습니까?'
        );
        if (confirmDelete) {
            if (cound.way === undefined) {
                const timestamp = Date.now(); // This would be the timestamp you want to format
                const filtered: any = orderHistory!.filter(
                    (order) =>
                        order.date + ', ' + order.product + ', ' + order.name ==
                        selected[0]
                );
                filtered[0]['confirmed'] = '찾기완료';
                filtered[0][
                    'fulfilledNeed_By'
                ] = auth.currentUser?.displayName!;
                filtered[0]['fulfilledNeed_Time'] = new Intl.DateTimeFormat(
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
                const timeStamp = Date.now();
                var date = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: undefined,
                    minute: undefined,
                    second: undefined,
                }).format(timeStamp);
                date = date.slice(-4) + '/' + date.slice(0, 5);
                const hour = new Intl.DateTimeFormat('en-US', {
                    year: undefined,
                    month: undefined,
                    day: undefined,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: undefined,
                }).format(timeStamp);
                const messages = {
                    date: date,
                    time: hour.slice(0, 5),
                    read: false,
                    title: filtered[0]['product'],
                    info: '찾기완료',
                };
                db.collection('user')
                    .doc(filtered[0]['uid'])
                    .update({
                        message: firebase.firestore.FieldValue.arrayUnion(
                            messages
                        ),
                    });
                db.collection('needs')
                    .doc('user')
                    .update({
                        needs: totalHistory!.filter(
                            (order) =>
                                order.date +
                                    ', ' +
                                    order.product +
                                    ', ' +
                                    order.name !==
                                selected[0]
                        ),
                    });
                db.collection('needs')
                    .doc('user')
                    .update({
                        needs: firebase.firestore.FieldValue.arrayUnion(
                            filtered[0]
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE Deleting adding new altered data to order -> user'
                );
                alert('필요해요 신청 확인 완료되었습니다.');
                setSelected([]);
                await delay(500);
                history.push('/');
            }
            else{
                const timestamp = Date.now(); // This would be the timestamp you want to format
                const filtered: any = orderHistory!.filter(
                    (order) =>
                        order.date + ', ' + order.product + ', ' + order.name ==
                        selected[0]
                );
                filtered[0]['confirmed'] = '찾기완료';
                filtered[0][
                    'fulfilledNeed_By'
                ] = auth.currentUser?.displayName!;
                filtered[0]['fulfilledNeed_Time'] = new Intl.DateTimeFormat(
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
                const timeStamp = Date.now();
                var date = new Intl.DateTimeFormat('en-US', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit',
                    hour: undefined,
                    minute: undefined,
                    second: undefined,
                }).format(timeStamp);
                date = date.slice(-4) + '/' + date.slice(0, 5);
                const hour = new Intl.DateTimeFormat('en-US', {
                    year: undefined,
                    month: undefined,
                    day: undefined,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: undefined,
                }).format(timeStamp);
                db.collection('needs')
                    .doc('user')
                    .update({
                        needs: totalHistory!.filter(
                            (order) =>
                                order.date +
                                    ', ' +
                                    order.product +
                                    ', ' +
                                    order.name !==
                                selected[0]
                        ),
                    });
                db.collection('needs')
                    .doc('user')
                    .update({
                        needs: firebase.firestore.FieldValue.arrayUnion(
                            filtered[0]
                        ),
                    });
                console.log(
                    '[' +
                        Date.now() +
                        ']' +
                        'DONE Deleting adding new altered data to order -> user'
                );
                alert('필요해요(방문) 신청 확인 완료되었습니다.');
                setSelected([]);
                await delay(500);
                history.push('/');
            }

            //finding user's info's order and deleting, and updating it with confirmed order
            
        }
    };
    useEffect(() => {
        //처음 돌면서 현재 오더 안에 서 모든 document 를 OrderHistory 및 USER 에 PUSH
        db.collection('needs')
            .doc('user')
            .get()
            .then((doc) => {
                setOrderHistory([
                    ...doc
                        .data()!
                        .needs.filter(
                            (unconfirmed: any) =>
                                unconfirmed.confirmed === '미확인'
                        ),
                ]);
                setOrderUser([
                    ...doc
                        .data()!
                        .needs.filter(
                            (unconfirmed: any) =>
                                unconfirmed.confirmed === '미확인'
                        ),
                ]);
                setTotalHistory([...doc.data()!.needs]);
            });
        // setChange(true);
    }, [...selected]);
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
                                            row.product +
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
                                                        row.product +
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
                                                row.product +
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
                                                {row.name}
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
                                                {row.product}
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
                                                {row.price_range}
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
            {/* <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="축소"
      /> */}
            {/* <Button className="buttons" style={{fontFamily: 'TmoneyRoundWindExtraBold', padding:"4px"}} variant="outlined" onClick={()=>{showModal()}} >선택</Button> */}
            {onOff ? (
                <div
                    className="modal"
                    id="pot"
                    style={{ margin: 'auto', padding: '0px 0 ', width: '90%' }}
                >
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        시간: {cound.date}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        성함: {cound.name}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        용품: {cound.product}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        용도: {cound.usage}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        색갈: {cound.color}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        가격대: {cound.price_range}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        기타: {cound.etc}
                    </div>
                    <div
                        style={{
                            textAlign: 'left',
                            padding: '10px',
                            color: 'black',
                        }}
                    >
                        신청방법:{' '}
                        {cound.way !== undefined ? cound.way : '온라인 신청'}
                    </div>
                    <Button
                        className="buttons"
                        style={{
                            fontFamily: 'TmoneyRoundWindExtraBold',
                            padding: '10px',
                            width: '100%',
                            margin: 'auto',
                            marginBottom: '20px',
                        }}
                        variant="outlined"
                        onClick={() => {
                            finished(auth.currentUser?.displayName!);
                        }}
                    >
                        찾기 완료
                    </Button>
                </div>
            ) : (
                <></>
            )}
        </div>
    );
}
