 WITH names AS (
  SELECT first_name, last_name, row_number() OVER () as rn
  FROM (VALUES
    ('James', 'Smith'), ('Emma', 'Johnson'), ('Michael', 'Williams'), ('Olivia', 'Brown'),
    ('William', 'Jones'), ('Ava', 'Garcia'), ('David', 'Miller'), ('Sophia', 'Davis'),
    ('John', 'Rodriguez'), ('Isabella', 'Martinez'), ('Joseph', 'Hernandez'), ('Mia', 'Lopez'),
    ('Thomas', 'Gonzalez'), ('Charlotte', 'Wilson'), ('Christopher', 'Anderson'), ('Amelia', 'Taylor'),
    ('Daniel', 'Moore'), ('Harper', 'Jackson'), ('Matthew', 'Martin'), ('Evelyn', 'Lee'),
    ('Andrew', 'Perez'), ('Abigail', 'Thompson'), ('Joshua', 'White'), ('Emily', 'Harris'),
    ('Alexander', 'Sanchez'), ('Elizabeth', 'Clark'), ('Ryan', 'Ramirez'), ('Sofia', 'Lewis'),
    ('Tyler', 'Robinson'), ('Victoria', 'Walker'), ('Jack', 'Young'), ('Camila', 'Allen'),
    ('Owen', 'King'), ('Scarlett', 'Wright'), ('Henry', 'Scott'), ('Madison', 'Torres'),
    ('Sebastian', 'Nguyen'), ('Luna', 'Hill'), ('Gabriel', 'Flores'), ('Grace', 'Green'),
    ('Julian', 'Adams'), ('Chloe', 'Baker'), ('Wyatt', 'Nelson'), ('Zoey', 'Hall'),
    ('Isaac', 'Rivera'), ('Penelope', 'Campbell'), ('Luke', 'Mitchell'), ('Riley', 'Carter'),
    ('Anthony', 'Roberts'), ('Layla', 'Gomez'), ('Dylan', 'Phillips'), ('Nora', 'Evans')
  ) AS n(first_name, last_name)
)
INSERT INTO users (first_name, last_name, nickname, password, email, birthdate, location, gender, job_title, phone, created_at)
SELECT 
    first_name,
    last_name,
    LOWER(SUBSTRING(first_name, 1, 1) || last_name || rn) as nickname,
    MD5(RANDOM()::TEXT) as password,
    LOWER(first_name || '.' || last_name || '@' || 
        (ARRAY['gmail.com', 'yahoo.com', 'outlook.com', 'icloud.com', 'hotmail.com'])[1 + mod(rn, 5)]) as email,
    (CURRENT_DATE - (20 + (RANDOM() * 40))::INTEGER * INTERVAL '1 year' - (RANDOM() * 365)::INTEGER * INTERVAL '1 day') as birthdate,
    (ARRAY[
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
        'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
        'London, UK', 'Toronto, CA', 'Sydney, AU', 'Berlin, DE', 'Paris, FR'
    ])[1 + mod(rn, 15)] as location,
    (ARRAY['Male', 'Female'])[1 + mod(rn, 2)] as gender,
    (ARRAY[
        'Software Engineer', 'Data Scientist', 'Product Manager', 'UX Designer', 'Marketing Specialist',
        'Financial Analyst', 'HR Manager', 'Business Development Manager', 'Content Writer', 'Sales Executive',
        'Operations Manager', 'Research Scientist', 'Project Manager', 'Digital Marketing Manager', 'System Administrator',
        'Business Analyst', 'Quality Assurance Engineer', 'Account Manager', 'Customer Success Manager', 'DevOps Engineer'
    ])[1 + mod(rn, 20)] as job_title,
    '+1-' || 
    LPAD((200 + mod(RANDOM()::INTEGER, 744))::TEXT, 3, '0') || '-' || 
    LPAD((mod(RANDOM()::INTEGER, 999))::TEXT, 3, '0') || '-' || 
    LPAD((1000 + mod(RANDOM()::INTEGER, 8999))::TEXT, 4, '0') as phone,
    CURRENT_TIMESTAMP as created_at
FROM names;

INSERT INTO tags (title, description, created_at)
VALUES
    ('Technology', 'Latest developments in tech, including AI, blockchain, and quantum computing', CURRENT_TIMESTAMP),
    ('Programming', 'Software development tips, tricks, and best practices', CURRENT_TIMESTAMP),
    ('Travel', 'Exploring destinations, travel guides, and cultural experiences', CURRENT_TIMESTAMP),
    ('Food', 'Recipes, restaurant reviews, and culinary adventures', CURRENT_TIMESTAMP),
    ('Health', 'Wellness tips, fitness advice, and mental health awareness', CURRENT_TIMESTAMP),
    ('Sports', 'Coverage of major sports events, athlete profiles, and fitness trends', CURRENT_TIMESTAMP),
    ('Music', 'Album reviews, concert coverage, and music industry news', CURRENT_TIMESTAMP),
    ('Movies', 'Film reviews, behind-the-scenes insights, and cinema analysis', CURRENT_TIMESTAMP),
    ('Books', 'Literary reviews, author interviews, and reading recommendations', CURRENT_TIMESTAMP),
    ('Art', 'Gallery exhibitions, artist profiles, and art market trends', CURRENT_TIMESTAMP),
    ('Science', 'Scientific breakthroughs, research findings, and space exploration', CURRENT_TIMESTAMP),
    ('Business', 'Entrepreneurship insights, market analysis, and industry trends', CURRENT_TIMESTAMP),
    ('Education', 'Learning resources, academic insights, and educational technology', CURRENT_TIMESTAMP),
    ('Gaming', 'Video game reviews, esports coverage, and gaming industry news', CURRENT_TIMESTAMP),
    ('Lifestyle', 'Personal development, work-life balance, and modern living tips', CURRENT_TIMESTAMP);

WITH post_content AS (
  SELECT title_template, content_template, row_number() OVER () as rn
  FROM (VALUES
    ('The Future of Artificial Intelligence', 'Exploring how AI is revolutionizing industries from healthcare to transportation. Recent breakthroughs in machine learning have opened new possibilities for automation and decision-making. Here''s what experts predict for the next decade.'),
    ('Sustainable Living in Urban Areas', 'Practical tips for reducing your carbon footprint while living in the city. From vertical gardening to zero-waste shopping, urban dwellers are finding creative ways to live sustainably.'),
    ('Remote Work Best Practices', 'How to maintain productivity and work-life balance in a remote environment. Essential tools, communication strategies, and tips for staying motivated when working from home.'),
    ('Understanding Blockchain Technology', 'A comprehensive guide to blockchain and its applications beyond cryptocurrency. How distributed ledger technology is transforming various industries.'),
    ('Mental Health in the Digital Age', 'Strategies for maintaining mental wellness in an increasingly connected world. The impact of social media on mental health and ways to establish healthy digital habits.'),
    ('The Rise of Plant-Based Diets', 'Exploring the health and environmental benefits of plant-based eating. Popular alternatives, nutritional considerations, and delicious recipes.'),
    ('Modern Web Development Trends', 'Latest frameworks, tools, and methodologies shaping the future of web development. Best practices for building scalable and maintainable applications.'),
    ('Space Exploration Milestones', 'Recent achievements in space exploration and what they mean for the future of humanity. From Mars missions to commercial space travel.'),
    ('Financial Independence Strategies', 'Practical approaches to achieving financial freedom through smart investing and money management. Building wealth in the modern economy.'),
    ('Photography for Beginners', 'Essential tips and techniques for getting started with photography. Understanding camera settings, composition, and post-processing basics.'),
    ('Mindfulness and Meditation', 'Incorporating mindfulness practices into daily life for reduced stress and improved focus. Simple meditation techniques for beginners.'),
    ('Electric Vehicles Revolution', 'How electric vehicles are transforming transportation and their impact on the environment. Latest technologies and market trends.'),
    ('Cybersecurity Essentials', 'Protecting yourself and your data in the digital age. Common threats, security best practices, and privacy considerations.'),
    ('The Science of Sleep', 'Understanding sleep cycles and their impact on health and productivity. Tips for improving sleep quality and establishing better sleep habits.'),
    ('Modern Interior Design', 'Current trends in interior design and how to incorporate them into your space. Sustainable materials, color theory, and space optimization.')
  ) AS t(title_template, content_template)
)

INSERT INTO posts (author_id, title, content, created_at, rating, views, is_published, updated_at)
SELECT 
    (1 + mod(i, 50)) as author_id,
    pc.title_template || ' - Part ' || (1 + mod(i, 10))::TEXT ||
    CASE mod(i, 4) 
        WHEN 0 THEN ': Getting Started'
        WHEN 1 THEN ': Advanced Techniques'
        WHEN 2 THEN ': Expert Insights'
        WHEN 3 THEN ': Future Perspectives'
    END as title,
    pc.content_template || E'\n\n' ||
    CASE mod(i, 3)
        WHEN 0 THEN 'Recent studies have shown remarkable developments in this area. '
        WHEN 1 THEN 'Experts in the field continue to make groundbreaking discoveries. '
        WHEN 2 THEN 'Community feedback has been overwhelmingly positive about these developments. '
    END ||
    'This article explores the latest findings and their implications for the future.' as content,
    CURRENT_TIMESTAMP as created_at,
    (40 + (RANDOM() * 60))::INTEGER as rating,
    (500 + (RANDOM() * 9500))::INTEGER as views,
    CASE WHEN RANDOM() > 0.1 THEN true ELSE false END as is_published,
    CURRENT_TIMESTAMP - (RANDOM() * 365 * 2)::INTEGER * INTERVAL '1 day' - (RANDOM() * 24)::INTEGER * INTERVAL '1 hour' as updated_at
FROM generate_series(1, 500) i
CROSS JOIN post_content pc
WHERE mod(i, 15) = mod(pc.rn, 15);

WITH post_tags AS (
    SELECT 
        p.id as post_id,
        t.id as tag_id,
        ROW_NUMBER() OVER (PARTITION BY p.id ORDER BY RANDOM()) as rn
    FROM posts p
    CROSS JOIN tags t
    WHERE RANDOM() < 0.3
)
INSERT INTO posts_tags (post_id, tag_id, created_at)
SELECT post_id, tag_id, CURRENT_TIMESTAMP as created_at
FROM post_tags
WHERE rn <= 5;