# Nginx Proxy Configuration Fix - 2025-11-10

## Problem Summary

Frontend was experiencing `TypeError: Cannot read properties of undefined (reading 'map')` errors when accessing Material Management pages at `https://dlzrpxrppejh.sealoshzh.site/admin/materials`.

### Root Cause

The frontend nginx proxy was configured to proxy API requests to the **external public URL** instead of the **internal Kubernetes service**:

```nginx
# ❌ WRONG - External URL (caused 502 errors)
location /api {
    proxy_pass https://rtmfnnrfbmyt.sealoshzh.site;
}
```

This created a circular dependency and SSL handshake failures, resulting in 502 Bad Gateway errors when the frontend tried to fetch Material data.

## Solution Applied

Updated the nginx configuration to use the **internal Kubernetes service**:

```nginx
# ✅ CORRECT - Internal service
location /api {
    proxy_pass http://houduanceshi:5000;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_cache_bypass $http_upgrade;
    proxy_read_timeout 300s;
    proxy_connect_timeout 75s;
}
```

## Deployment Steps

1. **Created corrected nginx configuration**:
   - File: `/home/devbox/project/nginx-frontend.conf`
   - Points to internal service: `http://houduanceshi:5000`

2. **Updated Kubernetes ConfigMap**:
   ```bash
   kubectl create configmap nginx-config \
     --from-file=default.conf=/home/devbox/project/nginx-frontend.conf \
     -n ns-cxxiwxce --dry-run=client -o yaml | kubectl apply -f -
   ```

3. **Restarted frontend deployment**:
   ```bash
   kubectl rollout restart deployment frontend -n ns-cxxiwxce
   ```

## Verification Results

All Material APIs now working correctly:

- ✅ **GET /api/materials** - Returns materials list successfully
- ✅ **GET /api/materials/categories/list** - Returns 6 categories
- ✅ **GET /api/materials/categories/tree** - Returns tree structure

### Test Output
```
=== API Test Results ===

✅ Materials List: success=true
✅ Categories List: success=true
✅ Categories Tree: success=true
```

## Architecture Overview

```
Internet
   ↓
https://dlzrpxrppejh.sealoshzh.site (Ingress)
   ↓
frontend-service (ClusterIP on port 80)
   ↓
frontend pods (nginx)
   ↓ /api/* → proxy_pass http://houduanceshi:5000
   ↓
houduanceshi service (ClusterIP on port 5000)
   ↓
houduanceshi-bg46z pod (backend API)
   ↓
test-db-mongodb (MongoDB database)
```

## Backend Service Details

- **Pod**: houduanceshi-bg46z
- **Service**: houduanceshi (ClusterIP 10.96.189.74:5000)
- **Backend Process**: Node.js running on port 5000 (not PM2 - direct process)
- **Database**: test-db-mongodb.ns-cxxiwxce.svc:27017

## Frontend Service Details

- **Deployment**: frontend (2 replicas)
- **Service**: frontend-service (ClusterIP 10.96.106.141:80)
- **Pods**: frontend-664849865f-* (nginx serving static files + proxy)
- **Public URL**: https://dlzrpxrppejh.sealoshzh.site

## Configuration Files

- **Nginx Config**: ConfigMap `nginx-config` in namespace `ns-cxxiwxce`
- **Source File**: `/home/devbox/project/nginx-frontend.conf`
- **Backup**: `/home/devbox/project/frontend-deployment-backup.yaml`

## Material Management Features Available

### Public APIs (No Authentication Required)
- `GET /api/materials` - List all materials (supports filtering)
- `GET /api/materials/:id` - Get material details
- `GET /api/materials/categories/list` - Get all categories
- `GET /api/materials/categories/tree` - Get category tree

### Protected APIs (JWT Token Required)
- `POST /api/materials` - Create material
- `PUT /api/materials/:id` - Update material
- `DELETE /api/materials/:id` - Delete material
- `POST /api/materials/batch-delete` - Batch delete
- `POST /api/materials/categories` - Create category
- `PUT /api/materials/categories/:id` - Update category
- `DELETE /api/materials/categories/:id` - Delete category
- `PUT /api/materials/:id/review` - Review material (admin)
- `GET /api/materials/stats` - Get statistics (admin)

## Current Database State

- **Categories**: 6 items (木材, 石材, 金属, 布艺, 皮革, 玻璃)
- **Materials**: 0 items (empty, ready for creation)

## Access Information

- **Frontend URL**: https://dlzrpxrppejh.sealoshzh.site
- **Backend URL (internal)**: http://houduanceshi:5000
- **Backend URL (external)**: https://rtmfnnrfbmyt.sealoshzh.site
- **Material Admin**: https://dlzrpxrppejh.sealoshzh.site/admin/materials

## Testing Commands

```bash
# Test materials list
curl https://dlzrpxrppejh.sealoshzh.site/api/materials

# Test categories
curl https://dlzrpxrppejh.sealoshzh.site/api/materials/categories/tree

# Run comprehensive tests
node /home/devbox/project/test-apis.js
```

## Issue Resolution

- **Original Error**: `TypeError: Cannot read properties of undefined (reading 'map')`
- **Status**: ✅ **RESOLVED**
- **Cause**: Backend API was unreachable due to proxy misconfiguration
- **Fix**: Updated nginx to use internal Kubernetes service
- **Result**: All Material APIs now functioning correctly

---

**Fixed on**: 2025-11-10 23:02 UTC  
**Namespace**: ns-cxxiwxce  
**Cluster**: Sealos (hzh.sealos.run)
