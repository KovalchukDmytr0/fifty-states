Here’s a detailed and optimized database structure for the 50 States Pixel Project. This structure ensures scalability, data integrity, and efficient querying for features like state pages, user orders, and image management.

1. Database Tables
1.1. states Table
Stores metadata about each state.
Column Name
Type
Description
id
SERIAL
Primary key, unique ID for each state.
name
VARCHAR(50)
Full name of the state (e.g., "California").
abbreviation
CHAR(2)
State abbreviation (e.g., "CA").
shape_svg
TEXT
SVG data for the state shape.
created_at
TIMESTAMP
Timestamp when the state record was created.
updated_at
TIMESTAMP
Timestamp when the state record was last updated.


1.2. users Table
Stores user details who submit orders.
Column Name
Type
Description
id
SERIAL
Primary key, unique ID for each user.
email
VARCHAR(255)
Email address of the user.
created_at
TIMESTAMP
Timestamp when the user registered.


1.3. orders Table
Tracks user orders for pixel reservations.
Column Name
Type
Description
id
SERIAL
Primary key, unique ID for each order.
user_id
INTEGER
Foreign key referencing the users.id.
state_id
INTEGER
Foreign key referencing the states.id.
pixel_width
INTEGER
Width of the pixel area in pixels.
pixel_height
INTEGER
Height of the pixel area in pixels.
x_position
INTEGER
X-coordinate of the top-left corner of the area.
y_position
INTEGER
Y-coordinate of the top-left corner of the area.
image_data
BYTEA
Uploaded image binary data.
status
VARCHAR(50)
Status of the order (pending, approved, declined).
created_at
TIMESTAMP
Timestamp when the order was created.
updated_at
TIMESTAMP
Timestamp when the order was last updated.


1.4. admin_users Table
Manages admin accounts for approving/declining orders.
Column Name
Type
Description
id
SERIAL
Primary key, unique ID for each admin.
username
VARCHAR(50)
Unique username for the admin.
email
VARCHAR(255)
Email address of the admin.
password_hash
TEXT
Hashed password for secure authentication.
created_at
TIMESTAMP
Timestamp when the admin was created.
updated_at
TIMESTAMP
Timestamp when the admin was last updated.


1.5. state_images Table
Tracks all approved images placed on state pages.
Column Name
Type
Description
id
SERIAL
Primary key, unique ID for each image.
state_id
INTEGER
Foreign key referencing the states.id.
image_data
BYTEA
Binary data of the approved image.
x_position
INTEGER
X-coordinate of the top-left corner of the image.
y_position
INTEGER
Y-coordinate of the top-left corner of the image.
width
INTEGER
Width of the image in pixels.
height
INTEGER
Height of the image in pixels.
created_at
TIMESTAMP
Timestamp when the image was approved.


2. Relationships
users → orders:


One user can place multiple orders.
user_id in orders references id in users.
states → orders:


Each order is associated with a specific state.
state_id in orders references id in states.
states → state_images:


Each state page has multiple approved images.
state_id in state_images references id in states.
admin_users:


Admins do not directly relate to users or orders but manage the approval process.

3. Example Data
states Table
id
name
abbreviation
shape_svg
1
California
CA
<svg>...</svg>
2
Texas
TX
<svg>...</svg>
3
Florida
FL
<svg>...</svg>

users Table
id
email
created_at
1
user1@example.com
2023-01-01 12:00:00
2
user2@example.com
2023-01-02 12:00:00

orders Table
id
user_id
state_id
pixel_width
pixel_height
x_position
y_position
image_data
status
created_at
1
1
1
50
50
100
100
Binary Data
pending
2023-01-03 12:00:00

state_images Table
id
state_id
image_data
x_position
y_position
width
height
created_at
1
1
Binary Data
100
100
50
50
2023-01-04 12:00:00


4. Additional Considerations
Indexes:


Add indexes on state_id and user_id for faster querying in the orders and state_images tables.
Data Validation:


Ensure pixel dimensions and positions fit within the 1000x1000 canvas.
Storage:


Consider using a service like AWS S3 for storing large images instead of keeping them directly in the database.

Would you like me to help implement this database in SQL or provide further optimization suggestions?

