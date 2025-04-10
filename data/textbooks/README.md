# 教材数据文件结构

此目录包含按教育阶段和学科分类的教材数据文件。

## 目录结构

```
textbooks/
  ├── primary/       # 小学
  │   ├── chinese.json   # 语文
  │   ├── math.json      # 数学
  │   └── ...            # 其他学科
  ├── junior/        # 初中
  │   ├── chinese.json   # 语文
  │   ├── math.json      # 数学
  │   └── ...            # 其他学科
  ├── high/          # 高中
  │   └── ...
  ├── vocational/    # 职业教育
  │   └── ...
  ├── intellectual/  # 智力障碍
  │   └── ...
  ├── blind/         # 盲校
  │   └── ...
  └── deaf/          # 聋校
      └── ...
```

## 文件格式

每个JSON文件的格式如下：

```json
{
  "title": "教材类别标题",
  "books": [
    {
      "id": "唯一标识符",
      "name": "教材名称",
      "grade": "年级",
      "term": "学期",
      "version": "版本",
      "cover": "封面图片路径",
      "resource": "资源文件路径",
      "resource_type": "资源类型"
    },
    ...
  ]
}
```