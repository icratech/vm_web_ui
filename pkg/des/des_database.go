package des

import (
	"database/sql"
	"fmt"
	"log"
	"strings"

	// sqlx "github.com/jmoiron/sqlx"
	// _ "github.com/mattn/go-sqlite3"
	_ "github.com/lib/pq"

	"github.com/leehayford/go-sveltekit/pkg"
)

type DBI struct {
	Driver  string
	ConnStr string
	*sql.DB
}

func (dbi *DBI) Connect() (err error) { // fmt.Printf("Driver: %s\nConnStr: %s\n\n", d.Driver, d.ConnStr)
	dbi.DB, err = sql.Open(dbi.Driver, dbi.ConnStr)
	return err
}
func (dbi *DBI) Execute(qry string, params []interface{}) (err error) {
	err = dbi.Connect()
	stmt, err := dbi.DB.Prepare(qry)
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(params...)
	if err != nil {
		return err
	}
	defer dbi.DB.Close()
	return err
}
func (dbi *DBI) Select(qry string, params []interface{}) (rows *sql.Rows, err error) {
	err = dbi.Connect()
	stmt, err := dbi.DB.Prepare(qry)
	if err != nil {
		return rows, err
	}
	defer stmt.Close()

	rows, err = stmt.Query(params...)
	if err != nil {
		return rows, err
	}
	defer dbi.DB.Close()
	return rows, nil
}
func (dbi *DBI) Create(dbname string, clean bool, tbl_qrys []string) (err error) {

	dbname = strings.ToLower(dbname)
	fmt.Printf("(dbi *DBI) Create( %s, %v )\n", dbname, clean)

	admin_db := &DBI{Driver: pkg.DES_DB_DRIVER, ConnStr: pkg.ADMIN_DB_CONNECTION_STRING}
		
	var exists bool
	rows, err := admin_db.Select(PG_CHECK_EXISTS, []interface{}{dbname})
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()
	rows.Next()
	rows.Scan(&exists)
	fmt.Printf("%s exists:\t%v\n", dbname, exists)

	if exists && clean { 
		qry := fmt.Sprintf(`DROP DATABASE %s`, dbname)
		if err = admin_db.Execute(qry, []interface{}{}); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s has been dropped.\n", dbname)
		exists = false
	}

	if !exists {
		qry := fmt.Sprintf(
			`CREATE DATABASE %s %s`, 
			dbname, 
			`WITH
			OWNER = datacan
			ENCODING = 'UTF8'
			LC_COLLATE = 'C.UTF-8'
			LC_CTYPE = 'C.UTF-8'
			TABLESPACE = pg_default
			CONNECTION LIMIT = -1
			IS_TEMPLATE = False;`,
		)
		if err := admin_db.Execute(qry, []interface{}{}); err != nil {
			log.Fatal(err)
		}
		fmt.Printf("%s has been created.\n", dbname)
	}

	for _, qry := range tbl_qrys { 

		if err = dbi.Execute(qry, []interface{}{}); err != nil {
			log.Fatal(err)
		} 

	}

	return err
}
const PG_CHECK_EXISTS string = `SELECT EXISTS( 
	SELECT datname FROM pg_catalog.pg_database WHERE datname = $1
);`
const PG_CREATE_DES_DATABASE string = `CREATE DATABASE  WITH
	OWNER = datacan
	ENCODING = 'UTF8'
	LC_COLLATE = 'C.UTF-8'
	LC_CTYPE = 'C.UTF-8'
	TABLESPACE = pg_default
	CONNECTION LIMIT = -1
	IS_TEMPLATE = False;`


/* MAIN DATABASE */
type DESDatabase struct {
	DBI
	DESDevices []DESDevice
	DESJobs    []DESJob
}

var DB DESDatabase = DESDatabase{ 
	DBI: DBI{
		Driver:  pkg.DES_DB_DRIVER, 
		ConnStr: pkg.DES_DB_CONNECTION_STRING,
	},
}
func (desdb *DESDatabase) CreateDESDatabase(dbname string, clean bool) (err error) {

	if err = desdb.Create(dbname, clean, []string{
		PG_CREATE_DES_DEVICE_TABLE,
		PG_CREATE_DES_JOB_TABLE,
	}); err != nil {
		log.Fatal(err)
	}

	fmt.Println("CreateDESDatabase(...) COMPLETE.")
	return err
}
