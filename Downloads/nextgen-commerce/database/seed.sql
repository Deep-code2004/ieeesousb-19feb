-- Seed data for NextGen Commerce database

-- Insert products
INSERT OR IGNORE INTO products (id, name, price, description, category, image_url, unit, large_category, card_color, merchant_id) VALUES
('1', 'Organic Avocados', 4.99, 'Fresh, creamy organic avocados perfect for guacamole or salads', 'Fruits', 'https://picsum.photos/id/1080/400/400', 'piece', 'Fresh Produce', 'green', 'm-1'),
('2', 'Artisan Sourdough Bread', 5.49, 'Handcrafted sourdough bread with a crispy crust and soft interior', 'Bakery', 'https://picsum.photos/id/102/400/400', 'loaf', 'Bakery', 'orange', 'm-2'),
('3', 'Grass-Fed Beef Steak', 15.99, 'Premium grass-fed beef steak, aged for tenderness and flavor', 'Meat', 'https://picsum.photos/id/1060/400/400', 'lb', 'Meat & Seafood', 'red', 'm-1'),
('4', 'Fresh Salmon Fillet', 12.99, 'Wild-caught salmon fillet, rich in omega-3 fatty acids', 'Seafood', 'https://picsum.photos/id/326/400/400', 'lb', 'Meat & Seafood', 'blue', 'm-1'),
('5', 'Organic Kale', 3.49, 'Nutrient-dense organic kale, perfect for smoothies or salads', 'Vegetables', 'https://picsum.photos/id/1024/400/400', 'bunch', 'Fresh Produce', 'green', 'm-2'),
('6', 'Free-Range Eggs', 6.99, 'Farm-fresh free-range eggs from happy chickens', 'Dairy', 'https://picsum.photos/id/1002/400/400', 'dozen', 'Dairy & Eggs', 'orange', 'm-2'),
('7', 'Baby Spinach', 3.49, 'Tender baby spinach leaves, washed and ready to eat', 'Vegetables', 'https://picsum.photos/id/1015/400/400', 'bag', 'Fresh Produce', 'green', 'm-2'),
('8', 'Greek Yogurt', 4.99, 'Thick and creamy Greek yogurt, high in protein', 'Dairy', 'https://picsum.photos/id/1084/400/400', 'container', 'Dairy & Eggs', 'purple', 'm-1'),
('9', 'Organic Honey', 8.99, 'Raw organic honey from local beekeepers', 'Pantry', 'https://picsum.photos/id/1039/400/400', 'jar', 'Pantry Staples', 'orange', 'm-1'),
('10', 'Extra Virgin Olive Oil', 11.99, 'Premium extra virgin olive oil, cold-pressed and flavorful', 'Pantry', 'https://picsum.photos/id/1044/400/400', 'bottle', 'Pantry Staples', 'green', 'm-2');

-- Insert merchants
INSERT OR IGNORE INTO merchants (id, name, store_name, email, password, delivery_info) VALUES
('m-1', 'John Smith', 'Gourmet Foods Inc.', 'john@gourmetfoods.com', 'password123', 'Free delivery on orders over ₹500'),
('m-2', 'Sarah Johnson', 'Fresh Produce Direct', 'sarah@freshproduce.com', 'password456', 'Same-day delivery available');

-- Insert delivery people
INSERT OR IGNORE INTO delivery_people (id, name, phone, vehicle, license_plate, merchant_id) VALUES
('d1', 'Carlos Ray', '555-1234', 'Ford Transit', 'DELVR-1', 'm-1'),
('d2', 'Dana Scully', '555-5678', 'Toyota Prius', 'TRST-NO1', 'm-1'),
('d3', 'Max Rockatansky', '555-4321', 'V8 Interceptor', 'LAST-V8', 'm-2');

-- Insert customers
INSERT OR IGNORE INTO customers (id, name, address, email, phone) VALUES
('c1', 'Alice Johnson', '123 Maple St, Springfield, IL', 'alice.j@example.com', '555-0101'),
('c2', 'Bob Smith', '456 Oak Ave, Metropolis, NY', 'bob.s@example.com', '555-0102');

-- Insert sample orders
INSERT OR IGNORE INTO orders (id, product_id, product_name, product_image_url, price, quantity, customer_id, merchant_id, delivery_person_id, status, tracking_id) VALUES
('ord-1', '1', 'Organic Avocados', 'https://picsum.photos/id/1080/400/400', 4.99, 1, 'c1', 'm-1', 'd1', 'DELIVERED', 'VS123456789'),
('ord-2', '4', 'Fresh Salmon Fillet', 'https://picsum.photos/id/326/400/400', 12.99, 2, 'c2', 'm-1', 'd2', 'SHIPPED', 'VS987654321'),
('ord-3', '2', 'Artisan Sourdough Bread', 'https://picsum.photos/id/102/400/400', 5.49, 1, 'c1', 'm-2', 'd3', 'APPROVED', 'VSA1B2C3D4E'),
('ord-4', '7', 'Baby Spinach', 'https://picsum.photos/id/1015/400/400', 3.49, 2, 'c2', 'm-2', 'd1', 'PENDING_VERIFICATION', 'VSF5G6H7I8J');

-- Insert sample reviews
INSERT OR IGNORE INTO reviews (id, order_id, product_id, rating, comment, customer_name, status) VALUES
('r1', 'ord-1', '1', 5, 'Amazing quality avocados! Perfect for my morning toast.', 'Alice Johnson', 'APPROVED'),
('r2', 'ord-2', '4', 4, 'Fresh salmon, great taste. Would order again.', 'Bob Smith', 'APPROVED');
