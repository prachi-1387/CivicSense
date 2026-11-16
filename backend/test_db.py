from database import engine

try:
    with engine.connect() as connection:
        result = connection.exec_driver_sql("SELECT 1")
        print("Database connected successfully!")
        print("Test result:", result.scalar())

except Exception as e:
    print("Database connection failed!")
    print("Error:", e)