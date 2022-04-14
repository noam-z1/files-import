# System design assignment for a job interview

### Assignment details
Design a ETL system supporting hospital data from different hospitals (aka different data formats). Each hospital sends 2 types of files: patients and treatments records. Files are sent daily, and can contain millions of rows. 

The system should receive batch of two files (from every hospital) and import and store the data in a local DB.

### Basic Design

The system contains A service which is connected to a MongoDB database.
The service is built with NestJs, and contains two modules:
 - Hospitals module: Allows to register new hospitals to the system, also manages jwt authentication.
    - POST '/hospital/signup' - add hospital to system
    - POST '/hospital/login' - authenticate as a hospital (returns jwt bearer token)
    - PATCH '/hospital/update' - update unique data (needs authentication)

  - Files module: Upload files batch to server.
    - POST '/files' - upload <b>csv</b> files to server. Files types: *Patients*, *Treatments*

### Basic user flow

  1. Hospital is signing up to the system 
  2. User is logging in and receives a bearer token 
  3. User is uploading files via http request
  4. User receives ok response when file saved to local disk
  5. On the server:
    - Files are saved to local disk in format `${hospitalId}.${fileType}.${date}.csv`
    - Each file is read as a stream line by line
    - Lines are saved to DB in bulks of varied size (according to env variable)
    - File is deleted from disk when saving finished

### Design challanges and solutions

  - Data storing - Each hospital send different data types with different field names, pre defining schemas might be too complicated.
    The solution was obvious - use MongoDB because it's schema less, and collections can be created at run time. Therefore, if a new hospital is signing up to the system, a collection will be created when first data will be saved to collection, even if we don't know what data fields will be sent. so I receive better flexibility, and when adding a new hospital, no programmer needs to add a new schema, it's created by the csv file. We are losing the advantages of relational DB, and in particularly the connection between each hospital's tables, but we don't require it in this task.
      - Pros - Very robust and flexible, easy to add new data types ,easy to change DB intigrating methods
      - Cons - Can't verify data with schema, no relation between data tables, harder implementing to Nest (comparing to postgress/monogoose)

  - File size - Since files might contain millions of records, handling the files in the server might consume too much memory (especially if multiple hospitals send data at the same time), and delay the user waiting for response. The solution was To save the file to the local disk, respond 201 to the user, and than parse the file line by line, using a stream. On the downside, more request to the DB are performed, which can cost more and take more time. Using bulking will help reduce the traffic.
  
     - Pros - low memory usage, user not waiting during a long parsing proccess
     - Cons - More network traffic, no indication to user if parsing fails, 