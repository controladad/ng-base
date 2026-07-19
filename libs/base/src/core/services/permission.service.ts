import { computed, inject, Injectable } from '@angular/core';
import { ItemRecord } from '../interfaces';
import { AuthBaseStore } from '../states';

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private auth = inject(AuthBaseStore);

    public currentUserPermissions = computed<string[]>(() => this.auth.permissionKeysSignal()?.map((t) => t.toString()) ?? []);

    hasPermission(permission: string) {
        if (this.auth.isSuper()) return true;
        const currentPermissions = this.currentUserPermissions();
        return currentPermissions.includes(permission);
    }

    hasPermissions(permissions: string[]) {
        if (this.auth.isSuper()) return true;
        const currentPermissions = this.currentUserPermissions();
        return permissions.every(item => currentPermissions.includes(item));
    }

    filterItemRecords<T>(items: ItemRecord<T>[]) {
        return items.filter((t) => (t.permission ? this.hasPermission(t.permission) : true));
    }
}
