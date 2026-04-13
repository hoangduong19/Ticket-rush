import random

# Cấu hình dữ liệu mẫu tiếng Việt
surnames = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"]
middle_males = ["Văn", "Minh", "Đức", "Anh", "Quốc", "Hữu", "Thành", "Quang", "Trọng", "Tiến"]
middle_females = ["Thị", "Ngọc", "Diệu", "Thảo", "Quỳnh", "Mai", "Kim", "Hồng", "Bích", "Thu"]
first_males = ["Hùng", "Dũng", "Tuấn", "Tú", "Nam", "Bình", "Chiến", "Thắng", "Phúc", "An", "Hoàng", "Sơn", "Lâm", "Hải"]
first_females = ["Linh", "Lan", "Hương", "Vy", "Chi", "An", "Trang", "Hà", "Yến", "Phương", "Thủy", "Trà", "Giang"]

fixed_password = "$2a$10$aLqwxUpUuOorgAmPYRtEf.ywR.ZKmoedL2e6bihV92rwb/ux6d4we"

def generate_sql_line(i):
    is_male = random.choice([True, False])
    gender = "MALE" if is_male else "FEMALE"
    
    # Chọn tên ngẫu nhiên
    surname = random.choice(surnames)
    middle = random.choice(middle_males if is_male else middle_females)
    first = random.choice(first_males if is_male else first_females)
    display_name = f"{surname} {middle} {first}"
    
    # Tạo username không dấu đơn giản
    username = f"user_{i}_{random.randint(100, 999)}"
    age = random.randint(18, 60)
    avatar_url = f"https://i.pravatar.cc/150?u=user{i}"
    
    # Format câu lệnh SQL insert (ĐÃ BỎ userId)
    return f"INSERT INTO users (email, password_hash, age, display_name, gender, avatar_url) VALUES ('{username}', '{fixed_password}', {age}, '{display_name}', '{gender}', '{avatar_url}');"

# Tạo 200 dòng
sql_lines = [generate_sql_line(i) for i in range(1, 201)]

# Ghi ra file data.txt
with open("data.txt", "w", encoding="utf-8") as f:
    f.write("\n".join(sql_lines))

print("Đã tạo file data.txt thành công!")