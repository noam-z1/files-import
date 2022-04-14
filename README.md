# System design assignment for a job interview

## Assignment details
Design a ETL system supporting hospital data from different hospitals (aka different data formats). Each hospital sends 2 types of files: patients and treatments records. Files are sent daily, and can contain millions of rows. 

The system should receive a batch of two files (from every hospital) and import and store the data in a local DB.

### Basic Design

The system contains A service which is connected to a MongoDB database.
The service is built with NestJs, and contains two modules:
 - Hospitals module: Allows to register new hospitals to the system, and also manages jwt authentication.
    - POST '/hospital/signup' - add hospital to system
    - POST '/hospital/login' - authenticate as a hospital (returns jwt bearer token)
    - PATCH '/hospital/update' - update unique data (needs authentication)

  - Files module: Upload files batch to server.
    - POST '/files' - upload <b>csv</b> files to server. Files types: *Patients*, *Treatments*

### Basic user flow

  1. Hospital is signing up to system 
  2. User is logging in and receives a bearer token 
  3. User is uploading files via http request
  4. User receives ok response when file saved to local disk
  5. On the server:
    - Files are saved to local disk in format `${hospitalId}.${fileType}.${date}.csv`
    - Each file is read as a stream line by line
    - Lines are saved to DB in bulks of varied size (according to env variable)
    - File is deleted from disk when saving finished

### Design challenges and solutions

  - Data storing - Each hospital sends different data types with different field names, pre defining schemas might be too complicated.
  The solution was obvious - use MongoDB because it's schema less, and collections can be created at run time. Therefore, if a new hospital is signing up to the system, a collection will be created when first data will be saved to collection, even if we don't know what data fields will be sent. so I receive better flexibility, and when adding a new hospital, no programmer needs to add a new schema, it's created by the csv file. We are losing the advantages of relational DB, and in particular the connection between each hospital's tables, but we don't require it in this task.
    - Pros - Very robust and flexible, easy to add new data types ,easy to change DB integrating methods
    - Cons - Can't verify data with schema, no relation between data tables, harder implementing to Nest (comparing to postgres/mongoose)

  - File size - Since files might contain millions of records, handling the files in the server might consume too much memory (especially if multiple hospitals send data at the same time), and delay the user waiting for response. The solution was To save the file to the local disk, respond 201 to the user, and then parse the file line by line, using a stream. On the downside, more request to the DB are performed, which can cost more and take more time. Using bulking will help reduce the traffic.
    - Pros - low memory usage, user not waiting during a long parsing process
    - Cons - More network traffic, no indication to user if parsing fails

### Extra features

  - Data duplication - Users can define unique fields via hospitals update endpoint. When fields are defined, the insertion to the db will be performed via upsert, when those fields are the unique key. I chose this approach since it is very flexible and generic, and adding a new hospital or changing a table can be done by users and no programmer needs to work on it.
  - Authentication - The data sent by the hospitals might contain sensitive personal data. Currently implemented jwt authentication, in order to make only allowed personnel to upload data to the DB. 

### Personal challenges

  - It is the first time I work with non-relational DB. Nest has out of the box implementation for mongoose, so finding out how to implement mongo was also a challenge. Fortunately Nest is very easy to integrate.
  - It is the first time I implement jwt from scratch. Also on this topic Nest helps with guards implementation and strategy which helped with understanding how it is working
  - When implementing the upsert function on mongo, I didn't yet understand how to make bulk of it. Currently it is not implemented, so the upsert is done one by one, so it is again a problem of multiple network calls. I should learn how to fix it.
  - In the file interceptor, req.user type does not contain hospitalId attribute, as defined in the bearer token. I'm not sure if it's because of nest implementation or a callback problem. Anyway, if the file interceptor will use promise and not callback might be better if it's possible
  - Integrating csv parsing library was a bit of a challenge, integrating it with a stream. I found a library that didn't parse the first column correctly and I couldn't find a  solution, so I had to find another library. 