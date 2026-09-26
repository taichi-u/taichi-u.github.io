"""Create original editable Blender models and compact GLBs. No external assets.

Run: blender --background --factory-startup --python scripts/build-models.py
Re-running replaces only the three generated .blend/.glb files.
"""
import math
import sys
from pathlib import Path

import bpy
from mathutils import Vector

ROOT = Path(__file__).resolve().parents[1]
sys.dont_write_bytecode = True
sys.path.insert(0, str(ROOT / "scripts"))
from model_details import detailed_planet, refine_satellite, refine_robot
SOURCES = ROOT / "models"
EXPORTS = ROOT / "assets" / "models"
SOURCES.mkdir(exist_ok=True)
EXPORTS.mkdir(parents=True, exist_ok=True)


def material(name, color, metal=0.0, roughness=0.4):
    mat = bpy.data.materials.new(name)
    mat.diffuse_color = (*color, 1)
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Metallic"].default_value = metal
    bsdf.inputs["Roughness"].default_value = roughness
    return mat


def finish(obj, name, mat, bevel=0, smooth=False):
    obj.name = name
    obj.data.materials.append(mat)
    if bevel:
        modifier = obj.modifiers.new("Machined edges", "BEVEL")
        modifier.width = bevel
        modifier.segments = 2
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=modifier.name)
    if smooth:
        for poly in obj.data.polygons:
            poly.use_smooth = True
    return obj


def box(name, center, size, mat, bevel=0.025):
    bpy.ops.mesh.primitive_cube_add(size=1, location=center)
    obj = bpy.context.object
    obj.dimensions = size
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    return finish(obj, name, mat, bevel)


def sphere(name, center, radius, mat, segments=48, rings=24):
    bpy.ops.mesh.primitive_uv_sphere_add(segments=segments, ring_count=rings,
                                       radius=radius, location=center)
    return finish(bpy.context.object, name, mat, smooth=True)


def rod(name, start, end, radius, mat, end_radius=None, vertices=24, bevel=0.012):
    delta = Vector(end) - Vector(start)
    bpy.ops.mesh.primitive_cone_add(vertices=vertices, radius1=radius,
                                   radius2=radius if end_radius is None else end_radius,
                                   depth=delta.length,
                                   location=(Vector(start) + Vector(end)) / 2)
    obj = bpy.context.object
    obj.rotation_euler = delta.to_track_quat("Z", "Y").to_euler()
    return finish(obj, name, mat, bevel=bevel, smooth=True)


def ring(name, radius, thickness, mat, center=(0, 0, 0), rotation=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_segments=96, minor_segments=6,
                                    location=center, rotation=rotation,
                                    major_radius=radius, minor_radius=thickness)
    return finish(bpy.context.object, name, mat, smooth=True)


def satellite():
    box("Gold spacecraft bus", (0, 0, 0), (0.94, 0.82, 1.18), GOLD, 0.07)
    for z in (-0.59, 0.59):
        box("Bus end plate", (0, 0, z), (1.01, 0.89, 0.08), WHITE)
    for x in (-0.47, 0.47):
        for y in (-0.41, 0.41):
            rod("Corner strut", (x, y, -0.56), (x, y, 0.56), 0.025, SILVER)
    for side in (-1, 1):
        rod("Solar array hinge", (side * 0.45, 0, 0), (side * 0.89, 0, 0), 0.06, SILVER)
        box("Solar panel frame", (side * 1.72, 0, 0), (1.77, 0.085, 1.18), SILVER)
        for face in (-1, 1):
            for col in range(6):
                for row in range(4):
                    x = side * (0.89 + col * 0.277 + 0.137)
                    z = -0.54 + row * 0.277 + 0.13
                    box("Photovoltaic cell", (x, face * 0.054, z),
                        (0.257, 0.014, 0.257), SOLAR if (col + row) % 3 else BLUE, 0)
        for x in (0.86, 2.58):
            box("Panel end rail", (side * x, 0, 0), (0.035, 0.11, 1.22), WHITE, 0.008)
    rod("Antenna pedestal", (0, 0, 0.6), (0, 0, 0.83), 0.13, SILVER)
    # A shallow parabolic dish made from our own radial mesh.
    verts = [(0, 0, 0.84)]
    faces = []
    for row in range(1, 9):
        radius = row / 8 * 0.67
        for i in range(48):
            angle = i / 48 * math.tau
            verts.append((radius * math.cos(angle), radius * math.sin(angle),
                          0.84 + radius ** 2 * 0.58))
            if row == 1:
                faces.append((0, 1 + i, 1 + (i + 1) % 48))
            else:
                a = 1 + (row - 2) * 48 + i
                b = 1 + (row - 2) * 48 + (i + 1) % 48
                faces.append((a, a + 48, b + 48, b))
    mesh = bpy.data.meshes.new("Parabolic dish mesh")
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    obj = bpy.data.objects.new("High gain antenna", mesh)
    bpy.context.collection.objects.link(obj)
    finish(obj, obj.name, WHITE, smooth=True)
    ring("Dish rim", 0.67, 0.022, SILVER, center=(0, 0, 1.10))
    rod("Feed", (0, 0, 0.85), (0, 0, 1.32), 0.032, GOLD)
    for angle in (0, math.tau / 3, 2 * math.tau / 3):
        rod("Feed support", (0.6 * math.cos(angle), 0.6 * math.sin(angle), 1.05),
            (0, 0, 1.27), 0.012, SILVER, vertices=12)
    rod("Thruster", (0, 0, -0.63), (0, 0, -0.87), 0.14, DARK, 0.23)
    box("Optical sensor housing", (0, -0.48, 0.15), (0.36, 0.24, 0.32), WHITE)
    rod("Optical sensor", (0, -0.56, 0.15), (0, -0.64, 0.15), 0.115, DARK)
    rod("Optical lens", (0, -0.64, 0.15), (0, -0.65, 0.15), 0.075, BLUE)


def robot():
    rod("Base plate", (0, 0, 0), (0, 0, 0.18), 0.66, DARK, vertices=48)
    rod("Base housing", (0, 0, 0.18), (0, 0, 0.46), 0.48, WHITE, 0.4, 48)
    ring("Base trim", 0.43, 0.027, BLUE, center=(0, 0, 0.36))
    shoulder, elbow, wrist = (0, 0, 0.7), (-0.62, 0, 1.85), (0.44, 0, 2.38)
    box("Shoulder mount", (0, 0, 0.57), (0.46, 0.48, 0.33), WHITE, 0.06)
    for name, center, radius in (("Shoulder", shoulder, 0.26),
                                 ("Elbow", elbow, 0.22), ("Wrist", wrist, 0.17)):
        x, y, z = center
        rod(name + " joint", (x, -0.28, z), (x, 0.28, z), radius, DARK)
        for side in (-1, 1):
            rod(name + " cover", (x, side * 0.28, z), (x, side * 0.305, z), radius * 0.83, BLUE)
            rod(name + " hub", (x, side * 0.305, z), (x, side * 0.32, z), radius * 0.32, SILVER)
    rod("Upper arm", shoulder, elbow, 0.19, WHITE, 0.16)
    rod("Forearm", elbow, wrist, 0.15, WHITE, 0.11)
    rod("Upper arm blue insert", (0, -0.175, 0.83), (-0.55, -0.175, 1.78), 0.036, BLUE)
    rod("Forearm actuator", (-0.52, 0.19, 1.87), (0.38, 0.19, 2.3), 0.045, SILVER)
    tool = (0.72, 0, 2.12)
    rod("Tool flange", wrist, tool, 0.125, SILVER)
    box("Gripper body", tool, (0.27, 0.38, 0.23), DARK, 0.04)
    for side in (-1, 1):
        rod("Gripper finger", (0.73, side * 0.22, 2.1), (0.89, side * 0.22, 1.83), 0.045, WHITE)
        box("Gripper fingertip", (0.91, side * 0.16, 1.83), (0.10, 0.15, 0.07), DARK, 0.01)
    for x in (-0.37, 0.37):
        for y in (-0.37, 0.37):
            rod("Base fastener", (x, y, 0.18), (x, y, 0.195), 0.038, SILVER, vertices=6)


def export(name):
    # Keep every part editable in Blender, merge by material only for the web copy.
    for area in bpy.context.screen.areas:
        if area.type == "VIEW_3D":
            area.spaces.active.region_3d.view_distance = 7
            area.spaces.active.region_3d.view_location = (0, 0, 0.8 if name == "robot" else 0)
            area.spaces.active.shading.type = "MATERIAL"
    bpy.context.scene["provenance"] = "Original geometry and materials; generated by scripts/build-models.py. No third-party models, textures, fonts, logos, or HDRIs."
    bpy.context.preferences.filepaths.save_version = 0
    bpy.ops.wm.save_as_mainfile(filepath=str(SOURCES / f"{name}.blend"), compress=True)
    groups = {}
    for obj in list(bpy.context.scene.objects):
        if obj.type == "MESH":
            groups.setdefault(obj.active_material.name, []).append(obj)
    for objects in groups.values():
        if len(objects) == 1:
            continue
        bpy.ops.object.select_all(action="DESELECT")
        for obj in objects:
            obj.select_set(True)
        bpy.context.view_layer.objects.active = objects[0]
        bpy.ops.object.join()
    bpy.ops.export_scene.gltf(filepath=str(EXPORTS / f"{name}.glb"),
                             export_format="GLB", export_apply=True,
                             export_animations=False, export_cameras=False,
                             export_lights=False, export_texcoords=name == "planet",
                             export_yup=True)
    print(f"MODEL_READY {name}: {(EXPORTS / f'{name}.glb').stat().st_size} bytes")


for name, build in (("planet", None), ("satellite", satellite), ("robot", robot)):
    bpy.ops.wm.read_factory_settings(use_empty=True)
    BLUE = material("Cobalt blue", (0.026, 0.16, 0.53), 0.22, 0.32)
    WHITE = material("Ceramic white", (0.85, 0.88, 0.84), 0.12, 0.3)
    GOLD = material("Warm anodized gold", (0.66, 0.37, 0.09), 0.55, 0.36)
    SILVER = material("Brushed aluminum", (0.47, 0.55, 0.62), 0.65, 0.32)
    DARK = material("Graphite", (0.027, 0.043, 0.063), 0.32, 0.36)
    SOLAR = material("Indigo solar cells", (0.016, 0.046, 0.19), 0.38, 0.26)
    if name == "planet":
        detailed_planet(sphere, material, SOURCES)
    else:
        build()
        if name == "satellite":
            refine_satellite(box, rod, ring, material)
        else:
            refine_robot(box, rod, ring, material)
    export(name)
