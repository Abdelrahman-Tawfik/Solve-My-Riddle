import {Table} from "react-bootstrap";

function RankingTable(props) {

    const ranked = props.users
        .sort((x, y) => y.score - x.score) // sort the data in descending order
        .map((x, i) => Object.assign({rank: i + 1}, x)); // copy object with rank


    return (

        <Table className="rank-table mt-5" striped borderless hover variant="dark" >
            <thead>
            <tr>
                <th>Rank</th>
                <th>Name</th>
                <th>Score</th>
            </tr>
            </thead>
            <tbody>
            {
                ranked.map((user) =>
                    <RankingRow key={user.userId}  user={user} />
                )
            }
            </tbody>
        </Table>
    );
}
function RankingRow(props) {
    return (
        <tr>
            <td>
                <p>
                    {`${props.user.rank}`}
                </p>
            </td>
            <td>
                <p>
                    {`${props.user.name}`}
                </p>
            </td>
            <td>
                <p>
                    {`${props.user.score}`}
                </p>
            </td>
        </tr>
    );
}

export default RankingTable;