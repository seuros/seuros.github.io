---
title: "NoFlyList: How NoFlyList Optimizes Tag Queries"
slug: "noflylist-how-noflylist-optimizes-tag-queries-3hbd"
pubDate: 2024-12-20T14:55:07.317Z
description: "Database-Specific Strategies   NoFlyList automatically detects your database type and uses..."

tags: ["rails", "tutorial"]
---

## Database-Specific Strategies

NoFlyList automatically detects your database type and uses optimized queries:

```ruby
class Product < ApplicationRecord
  include NoFlyList::TaggableRecord
  has_tags :categories
end

# This generates different SQL for each database
Product.with_any_categories("electronics", "gaming")
```

## PostgreSQL Optimization

PostgreSQL query:
```ruby
# Using array operators and CTE for better performance
SELECT "products".*
FROM "products"
WHERE "products"."id" IN (
  SELECT DISTINCT "products"."id"
  FROM products
  INNER JOIN "product_taggings" ON "product_taggings"."taggable_id" = "products"."id"
  INNER JOIN "product_tags" ON "product_tags"."id" = "product_taggings"."tag_id"
  WHERE "product_taggings"."context" = 'category'
  AND "product_tags"."name" = ANY(ARRAY['electronics', 'gaming'])
)
```

## MySQL Optimization

MySQL query:
```ruby
# Using FIND_IN_SET and subqueries
SELECT `products`.*
FROM `products`
WHERE `products`.`id` IN (
  SELECT `products`.`id`
  FROM products
  INNER JOIN `product_taggings` ON `product_taggings`.`taggable_id` = `products`.`id`
  INNER JOIN `product_tags` ON `product_tags`.`id` = `product_taggings`.`tag_id`
  WHERE `product_taggings`.`context` = 'category'
  AND `product_tags`.`name` IN ('electronics', 'gaming')
  GROUP BY `products`.`id`
)
```

## SQLite Optimization

SQLite query:
```ruby
# Optimized for SQLite's simpler query planner
SELECT "products".*
FROM "products"
WHERE "products"."id" IN (
  SELECT "products"."id"
  FROM products
  INNER JOIN product_taggings ON product_taggings.taggable_id = products.id
  INNER JOIN product_tags ON product_tags.id = product_taggings.tag_id
  WHERE product_taggings.context = 'category'
  AND product_tags.name IN ('electronics', 'gaming')
)
```

## Complex Queries

```ruby
# Finding products with ALL specified tags
Product.with_all_categories("electronics", "gaming")

# PostgreSQL uses:
SELECT "products".*
FROM "products"
WHERE "products"."id" IN (
  SELECT "products"."id"
  FROM products
  INNER JOIN "product_taggings" ON "product_taggings"."taggable_id" = "products"."id"
  INNER JOIN "product_tags" ON "product_tags"."id" = "product_taggings"."tag_id"
  WHERE "product_taggings"."context" = 'category'
  AND "product_tags"."name" IN ('electronics', 'gaming')
  GROUP BY "products"."id"
  HAVING COUNT(DISTINCT "product_tags"."name") = 2
)

# Finding products without specific tags
Product.without_any_categories("discontinued")

# Finding products with exact tag set
Product.with_exact_categories(["electronics", "gaming"])
```

## Performance Tips

1. Index Optimization:
```ruby
class CreateProductTags < ActiveRecord::Migration[7.2]
  def change
    add_index :product_tags, :name
    add_index :product_taggings, [:taggable_id, :taggable_type, :context]
  end
end
```

Unlike AATO, the gem support multiple database connections and mixed adapters.

2. Counter Cache:
```ruby
class Product < ApplicationRecord
  has_tags :categories, counter_cache: true
end
```

3. Eager Loading:
```ruby
# Efficient loading of products with their tags
Product.includes(:categories)
       .with_any_categories("electronics")
```

## Debugging Queries

Use query logging to see optimizations:

```ruby
# config/environments/development.rb
config.active_record.verbose_query_logs = true

# In console
Product.with_any_categories("electronics").explain
```

## Common Patterns

1. Category Trees:
```ruby
Product.with_all_categories("electronics")
       .with_any_categories("gaming", "professional")
```

2. Exclusions:
```ruby
Product.with_any_categories("electronics")
       .without_any_categories("discontinued", "clearance")
```

3. Exact Matching:
```ruby
Product.with_exact_categories(["gaming", "electronics"])
```

Each pattern generates optimized SQL based on your database.
If you know a better query, feel free to open a pull request on the adapter query.